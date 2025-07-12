const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    skillsOffered: [
      {
        type: String,
        default: [],
      },
    ],
    skillsWanted: [
      {
        type: String,
        default: [],
      },
    ],
    availability: {
      type: String,
      enum: ["Available", "Busy"],
      default: "Available",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalSwaps: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ name: "text", skillsOffered: "text", skillsWanted: "text" });

const User = mongoose.model("User", userSchema);

module.exports = User;
