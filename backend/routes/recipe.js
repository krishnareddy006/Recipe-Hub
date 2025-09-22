// import express from "express";
// import { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload } from "../controller/recipe.js";
// import verifyToken from "../middleware/auth.js";

// const recipeRouter = express.Router();

// recipeRouter.get("/", getRecipes);
// recipeRouter.get("/:id", getRecipe);
// recipeRouter.post("/", upload.single("file"), verifyToken, addRecipe);
// recipeRouter.put("/:id", upload.single("file"), editRecipe);
// recipeRouter.delete("/:id", deleteRecipe);

// export default recipeRouter;


import express from "express";
import { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload } from "../controller/recipe.js";
import verifyToken from "../middleware/auth.js";

const recipeRouter = express.Router();

recipeRouter.get("/", getRecipes);
recipeRouter.get("/:id", getRecipe);
recipeRouter.post("/", upload.single("file"), verifyToken, addRecipe); // ✅ Correct order
recipeRouter.put("/:id", upload.single("file"), verifyToken, editRecipe); // ✅ Added verifyToken
recipeRouter.delete("/:id", verifyToken, deleteRecipe); // ✅ Added verifyToken

export default recipeRouter;
