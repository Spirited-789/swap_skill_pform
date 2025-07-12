const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use env var in production

// REGISTER CONTROLLER
const register = async (req, res) => {
  try {
    const { name, email, password, location, profileImage } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword, 
      location,
      profileImage,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN CONTROLLER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check if user is banned (optional)
    if (user.role === "banned") {
      return res.status(403).json({ error: "Account banned" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE USER PROFILE
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Disallow updates to sensitive fields
    delete updates.password;
    delete updates.email;
    delete updates.role;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { term, skill, availability, rating, sort } = req.query;
    const query = {
      isPublic: true,
      role: "user",
      ...(availability && { availability }),
    };

    if (term) {
      query.$text = { $search: term };
    }

    if (skill) {
      query.skillsOffered = skill;
    }

    const users = await User.find(query).select("-password");

    let filtered = users;

    if (rating) {
      const minRating = parseFloat(rating);
      filtered = filtered.filter(u => u.rating >= minRating);
    }

    // Sort logic
    switch (sort) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "swaps":
        filtered.sort((a, b) => b.totalSwaps - a.totalSwaps);
        break;
      case "recent":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    res.json(filtered);
  } catch (err) {
    console.error("Search Users Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  register, 
  login, 
  getUserProfile,
  updateUserProfile,
  searchUsers
};


