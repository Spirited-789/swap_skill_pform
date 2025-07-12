const mongoose = require("mongoose");


// SwapRequest Schema
const swapRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillOffered: {
      type: String,
      required: true,
    },
    skillWanted: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

// Indexes
swapRequestSchema.index({ fromUserId: 1, toUserId: 1 });
swapRequestSchema.index({ status: 1 });

const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);

module.exports = SwapRequest;
