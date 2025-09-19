import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSignUp = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);   
        const newUser = await User.create({ email, password: hashedPassword });
        let token=jwt.sign({email,id:newUser._id},process.env.SECRET_KEY);
        return res.status(200).json({ token, user:newUser });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }   
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }
  try {
    const checkedUser = await User.findOne({ email });
    if (!checkedUser) {
      return res.status(400).json({ message: "User not found, please sign up first" });
    }

    const checkedPassword = await bcrypt.compare(password, checkedUser.password);
    if (checkedPassword) {
      let token = jwt.sign({ email, id: checkedUser._id }, process.env.SECRET_KEY);
      return res.status(200).json({ token, user: checkedUser });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ email:user.email });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export { userSignUp, userLogin, getUser };