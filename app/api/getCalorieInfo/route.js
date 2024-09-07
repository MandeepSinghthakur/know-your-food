// app/api/getCalorieInfo/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    const {promptText } = await req.json();
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key is missing. Please set your OPENAI_API_KEY environment variable.');
      }
    // Here you would call an external API to get the calorie information
    // For demonstration, we'll mock the response
   
    const openaiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that provides calorie information for ingredients."
            },
            {
              role: "user",
              content: promptText + '.Return the information as a JSON object with ingredient names as keys and calorie values as numbers'
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
    const calorieInfo = JSON.parse(openaiResponse.data.choices[0].message.content);
    return NextResponse.json({  calorieInfo }, { status: 200 });
  } catch (error) {
    console.error('Error fetching calorie information:', error);
    return NextResponse.json({ error: 'Failed to fetch calorie information' }, { status: 500 });
  }
}
