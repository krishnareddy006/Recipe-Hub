import Recipes from "../models/recipe.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + '-' + file.fieldname
      cb(null, filename)
    }
  })
  
const upload = multer({ storage: storage })

// Controllers
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    res.json(recipes);
  } catch (err) {
    console.error("getRecipes error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    res.json(recipe);
  } catch (err) {
    console.error("getRecipe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time, dietType, cuisineType, country } = req.body;

    // ✅ Check required fields only
    if (!title || !ingredients || !instructions || !time) {
      return res.status(400).json({ message: "Please provide title, ingredients, instructions, and time" });
    }

    // ✅ Normalize ingredients into an array
    let ingredientsArr = [];
    if (typeof ingredients === "string") {
      ingredientsArr = ingredients.split(",").map(s => s.trim());
    } else if (Array.isArray(ingredients)) {
      ingredientsArr = ingredients;
    }

    // ✅ Create new recipe
    const newRecipe = await Recipes.create({
      title,
      ingredients: ingredientsArr,
      instructions,
      time,
      coverImage: req.file ? req.file.filename : null,
      createdBy: req.user?.id || null, // ✅ Safe check in case no user
      dietType: dietType || "",        // optional fields → default empty string
      cuisineType: cuisineType || "",
      country: country || ""
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    console.error("addRecipe error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const editRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // ✅ Include new fields in update (req.body will contain all fields)
    const updated = await Recipes.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body, // ✅ This will include dietType, cuisineType, country
        coverImage: req.file ? req.file.filename : recipe.coverImage,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("editRecipe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    await Recipes.deleteOne({ _id: req.params.id });
    res.json({ status: "ok" });
  } catch (err) {
    console.error("deleteRecipe error:", err);
    res.status(400).json({ message: "error" });
  }
};

export { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
