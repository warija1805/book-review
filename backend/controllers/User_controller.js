import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const generateJwtToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({ name, email, password: hashedPassword });

    const token = generateJwtToken(createdUser._id.toString());
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: createdUser._id, name: createdUser.name, email: createdUser.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateJwtToken(user._id.toString());
    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login", error: error.message });
  }
};



