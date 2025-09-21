import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: Array, required: true },
    instructions: { type: String, required: true },
    time: { type: String },
    coverImage: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dietType: { type: String,required: true }, 
    cuisineType: { type: String,required: true }, 
    country: { type: String,required: true }
}, { timestamps: true });

const Recipes = mongoose.model("Recipes", recipeSchema);
export default Recipes;
