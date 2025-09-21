import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: Array, required: true },
    instructions: { type: String, required: true },
    time: { type: String },
    coverImage: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // ✅ NEW FIELDS - Simple strings for easy frontend handling
    dietType: { type: String,required: true }, // "Veg" or "Non-Veg"
    cuisineType: { type: String,required: true }, // "Salad", "Curry", "Dessert", etc.
    country: { type: String,required: true } // "Indian", "Italian", "Chinese", etc.
}, { timestamps: true });

const Recipes = mongoose.model("Recipes", recipeSchema);
export default Recipes;
