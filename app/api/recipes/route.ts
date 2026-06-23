import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/recipes -> get all saved recipes
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    await connectToDatabase();
    
    // If not authenticated, we could return 401, but the home page needs the total count.
    // For now, if there's no session, return all recipes so the home page counter works.
    // However, the saved page uses this too. We can check URL params.
    const url = new URL(request.url);
    const userOnly = url.searchParams.get("userOnly");
    
    let query = {};
    if (userOnly === "true") {
      if (!session || !session.user?.email) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      query = { userEmail: session.user.email };
    }
    
    // Sort by createdAt descending so newest are first
    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: recipes }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/recipes -> save a recipe
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized. Please sign in to save recipes." }, { status: 401 });
    }

    await connectToDatabase();
    
    const body = await request.json();
    body.userEmail = session.user.email;
    
    // Create new recipe document
    const newRecipe = await Recipe.create(body);
    
    return NextResponse.json({ success: true, data: newRecipe }, { status: 201 });
  } catch (error: any) {
    console.error("Error saving recipe:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
