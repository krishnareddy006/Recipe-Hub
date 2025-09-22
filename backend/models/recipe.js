import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: Array, required: true },
    instructions: { type: String, required: true },
    time: { type: String, required: true },
    coverImage: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dietType: { type: String, default: "" },
    cuisineType: { type: String, default: "" },
    country: { type: String, default: "" }
}, { timestamps: true });

const Recipes = mongoose.model("Recipes", recipeSchema);
export default Recipes;
