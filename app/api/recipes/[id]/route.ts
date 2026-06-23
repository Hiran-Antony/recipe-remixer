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
