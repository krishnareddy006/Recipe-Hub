import express from "express";
import {userSignUp, userLogin, getUser} from "../controller/user.js";
const userRouter= express.Router();    

userRouter.post("/SignUP", userSignUp);
userRouter.post("/Login", userLogin);
userRouter.get("/user/:id", getUser);

export default userRouter;