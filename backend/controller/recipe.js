import Recipes from "../models/recipe.js";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage using Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'recipe-hub',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
        ]
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Get all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    res.json(recipes);
  } catch (err) {
    console.error("getRecipes error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single recipe by ID
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    console.error("getRecipe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add new recipe
const addRecipe = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request user:", req.user);

    const { title, ingredients, instructions, time, dietType, cuisineType, country } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!instructions || !instructions.trim()) {
      return res.status(400).json({ message: "Instructions are required" });
    }
    if (!time || !time.trim()) {
      return res.status(400).json({ message: "Time is required" });
    }

    // Parse ingredients
    let ingredientsArr = [];
    if (ingredients) {
      if (Array.isArray(ingredients)) {
        ingredientsArr = ingredients.filter(item => item && item.trim());
      } else if (typeof ingredients === "string") {
        ingredientsArr = ingredients.split(",").map(s => s.trim()).filter(s => s);
      }
    }

    if (ingredientsArr.length === 0) {
      return res.status(400).json({ message: "At least one ingredient is required" });
    }

    // Save recipe
    const newRecipe = await Recipes.create({
      title: title.trim(),
      ingredients: ingredientsArr,
      instructions: instructions.trim(),
      time: time.trim(),
      coverImage: req.file ? req.file.path : null, // Cloudinary URL
      createdBy: req.user?.id || req.user?._id || null, 
      dietType: dietType || "",        
      cuisineType: cuisineType || "",
      country: country || ""
    });

    console.log("Recipe created successfully:", newRecipe);

    res.status(201).json({
      message: "Recipe added successfully",
      recipe: newRecipe
    });
  } catch (err) {
    console.error("addRecipe error:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message
    });
  }
};

// Edit recipe by ID
const editRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Parse ingredients
    let ingredientsArr = recipe.ingredients;
    if (req.body.ingredients) {
      if (Array.isArray(req.body.ingredients)) {
        ingredientsArr = req.body.ingredients.filter(item => item && item.trim());
      } else if (typeof req.body.ingredients === "string") {
        ingredientsArr = req.body.ingredients.split(",").map(s => s.trim()).filter(s => s);
      }
    }

    const updateData = {
      title: req.body.title || recipe.title,
      ingredients: ingredientsArr,
      instructions: req.body.instructions || recipe.instructions,
      time: req.body.time || recipe.time,
      dietType: req.body.dietType !== undefined ? req.body.dietType : recipe.dietType,
      cuisineType: req.body.cuisineType !== undefined ? req.body.cuisineType : recipe.cuisineType,
      country: req.body.country !== undefined ? req.body.country : recipe.country,
      coverImage: req.file ? req.file.path : recipe.coverImage
    };

    const updated = await Recipes.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Recipe updated successfully",
      recipe: updated
    });
  } catch (err) {
    console.error("editRecipe error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete recipe by ID
const deleteRecipe = async (req, res) => {
  try {
    console.log("Delete request for recipe ID:", req.params.id);
    console.log("User from token:", req.user);

    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Authorization check
    const userId = req.user?.id || req.user?._id;
    if (recipe.createdBy && recipe.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    // Delete image from Cloudinary if available
    if (recipe.coverImage) {
      try {
        const urlParts = recipe.coverImage.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        await cloudinary.uploader.destroy(`recipe-hub/${publicId}`);
        console.log("Image deleted from Cloudinary");
      } catch (cloudError) {
        console.error("Cloudinary delete error:", cloudError);
      }
    }

    await Recipes.deleteOne({ _id: req.params.id });
    console.log("Recipe deleted successfully");
    
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("deleteRecipe error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
