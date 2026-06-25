import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients) {
      return NextResponse.json({ error: "Ingredients are required" }, { status: 400 });
    }

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

    let attempts = 0;
    while (attempts < 2) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.3-70b-versatile',
        });

        let content = completion.choices[0]?.message?.content || '[]';
        
        // Clean markdown if present
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();

        const recipes = JSON.parse(content);
        return NextResponse.json({ recipes });
      } catch (e) {
        attempts++;
        if (attempts === 2) throw e;
      }
    }
  } catch (error: any) {
    console.error("Error calling Groq:", error);
    return NextResponse.json({ error: "AI is busy, try again" }, { status: 500 });
  }
}
