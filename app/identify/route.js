import { NextResponse } from 'next/server'
import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc'
import OpenAI from 'openai'

const stub = ClarifaiStub.grpc()
const metadata = new grpc.Metadata()
metadata.set('authorization', `Key ${process.env.CLARIFAI_API_KEY}`)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  const body = await request.json();
  const { image } = body;
  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  try {
    const buffer = await image.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    const clarifaiResponse = await new Promise((resolve, reject) => {
      stub.PostModelOutputs(
        {
          // Use the general food model
          model_id: 'food-item-v1-recognition',
          inputs: [{ data: { image: { base64: bytes } } }],
        },
        metadata,
        (err, response) => {
          if (err) {
            reject(err)
          } else if (response.status.code !== 10000) {
            reject(new Error(response.status.description))
          } else {
            resolve(response)
          }
        }
      )
    })

    const foodName = clarifaiResponse.outputs[0].data.concepts[0].name

    const ingredientsResponse = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `List the main ingredients of ${foodName}:`,
      max_tokens: 100,
    })

    const ingredients = ingredientsResponse.choices[0].text
      .trim()
      .split('\n')
      .map((ingredient) => ingredient.replace(/^\d+\.\s*/, '').trim())

    const caloriesResponse = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `Estimate the calories in a typical serving of ${foodName}:`,
      max_tokens: 50,
    })

    const calories = caloriesResponse.choices[0].text.trim()

    return NextResponse.json({
      name: foodName,
      ingredients,
      calories,
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
  }
}