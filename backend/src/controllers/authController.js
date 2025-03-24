import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// Register a user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (username < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    // Check if user already exists

    //    const existingUser = await User.findOne({$or: [{email}, {username}]});

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }

    // get a random avatar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new User({ username, email, password, profileImage });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Error in register user");
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
    console.log("User logged in successfully");
  } catch (error) {
    console.log("Error in login user");
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
