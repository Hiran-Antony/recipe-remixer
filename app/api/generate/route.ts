import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();

    // Empty input check
    if (!ingredients || ingredients.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide at least one ingredient' },
        { status: 400 }
      );
    }

    // Abuse prevention
    if (ingredients.length > 500) {
      return NextResponse.json(
        { error: 'Too many ingredients. Please limit to 20.' },
        { status: 400 }
      );
    }

    // API key missing check
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const prompt = `You are a professional chef. Given these ingredients: ${ingredients}
Return ONLY a JSON array of exactly 3 recipes.
Each recipe must have:
{
  title: string,
  description: string,
  cuisineType: string,
  prepTime: string,
  cookTime: string,
  difficulty: "Easy" | "Medium" | "Hard",
  servings: number,
  ingredients: string[],
  steps: string[],
  confidenceScore: number,
  cals: number,
  protein: number,
  carbs: number
}
Return only JSON, no extra text.`;

    let completion;
    try {
      completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'AI service failed. Please try again.' },
        { status: 500 }
      );
    }

    let content = completion.choices[0]?.message?.content || '';

    // Handle empty AI response
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'AI returned empty response' },
        { status: 500 }
      );
    }
    
    // Clean markdown if present
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    // JSON parse protection
    try {
      const recipes = JSON.parse(content);
      return NextResponse.json({ recipes });
    } catch {
      return NextResponse.json(
        { error: 'AI returned invalid response. Retrying...' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Error in generate route:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
