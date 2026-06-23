import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  steps: string[];
  cookTime: string;
  servings: string;
  userEmail?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: Date;
}

const RecipeSchema: Schema = new Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true },
  cookTime: { type: String, required: true },
  servings: { type: String, required: true },
  userEmail: { type: String, required: false },
  difficulty: { 
    type: String, 
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  createdAt: { type: Date, default: Date.now }
});

// Check if the model is already compiled to prevent recompilation errors in Next.js development
const Recipe: Model<IRecipe> = mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;
