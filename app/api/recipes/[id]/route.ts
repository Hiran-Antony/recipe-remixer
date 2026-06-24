import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    
    if (!deletedRecipe) {
      return NextResponse.json({ success: false, error: 'Recipe not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: deletedRecipe }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const body = await request.json();
    
    // Update the document and return the modified version
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedRecipe) {
      return NextResponse.json({ success: false, error: 'Recipe not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedRecipe }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating recipe:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
