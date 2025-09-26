import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectionDB.js";
import recipeRouter from "./routes/recipe.js";
import userRouter from "./routes/user.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/", userRouter);
app.use("/recipes", recipeRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
