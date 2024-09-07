// app/api/analyzeFood/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';

const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
const CLARIFAI_MODEL_ID = 'food-item-recognition'; // Adjust this to your specific Clarifai model

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

    // Check if API keys are set
    if (!CLARIFAI_API_KEY) {
      return NextResponse.json(
        { message: 'API keys for Clarifai or OpenAI are missing' },
        { status: 500 }
      );
    }

    // Step 1: Analyze Image with Clarifai
    const clarifaiResponse = await axios({
      method: 'POST',
      url: `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`,
      headers: {
        Authorization: `Key ${CLARIFAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        inputs: [
          {
            data: {
              image: {
                base64: imageBase64.split(',')[1]
              },
            },
          },
        ],
      },
    });

    const foodData = clarifaiResponse.data;
  //  console.log(clarifaiResponse, 'clarifaiResponse');
    const ingredients = foodData.outputs[0]?.data?.concepts.map((concept) => concept.name) || [];
    return NextResponse.json({ ingredients, foodData }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
  }
}
