// app/api/analyzeFood/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';

const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
const CLARIFAI_MODEL_ID = 'food-item-recognition'; // Adjust this to your specific Clarifai model

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

    // Check if API key is set
    if (!CLARIFAI_API_KEY) {
      return NextResponse.json(
        { message: 'API key for Clarifai is missing' },
        { status: 500 }
      );
    }

    // Analyze Image with Clarifai
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
    const concepts = foodData.outputs[0]?.data?.concepts || [];

    // Extract food name (assuming the first concept is the most likely food item)
    const foodName = concepts.length > 0 ? concepts[0].name : 'Unknown Food';
    // Extract ingredients (concepts after the first one, with confidence > 0.05)
    const ingredients = concepts.slice(1)
      .filter(concept => parseFloat(concept.value) > 0.035)
      .map(concept => concept.name);

    return NextResponse.json({ 
      foodName, 
      ingredients
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
  }
}