// backend/server.js
import express from "express";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
import cors from "cors";
import connectDB from "./config/connectionDB.js";
import recipeRouter from "./routes/recipe.js";
import userRouter from "./routes/user.js"; // if you have it

dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("public/images"));

// Serve images from the exact folder we write to
// const imagesDir = path.resolve(__dirname, "public", "images");
// app.use("/images", express.static(imagesDir));

// Optional: serve other public files
// app.use(express.static(path.resolve(__dirname, "public")));

app.use("/", userRouter);
app.use("/recipes", recipeRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
