import express from "express";
import { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload } from "../controller/recipe.js";
import verifyToken from "../middleware/auth.js";

const recipeRouter = express.Router();

recipeRouter.get("/", getRecipes);
recipeRouter.get("/:id", getRecipe);
recipeRouter.post("/", upload.single("file"), verifyToken, addRecipe);
recipeRouter.put("/:id", upload.single("file"), verifyToken, editRecipe);
recipeRouter.delete("/:id", verifyToken, deleteRecipe);

export default recipeRouter;
