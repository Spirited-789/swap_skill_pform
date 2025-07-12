const mongoose = require("mongoose");

// Feedback Schema
const feedbackSchema = new mongoose.Schema(
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
      swapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SwapRequest",
        required: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      comment: {
        type: String,
      },
    },
    { timestamps: true }
  );
  
  // Indexes
  feedbackSchema.index({ toUserId: 1 });
  feedbackSchema.index({ swapId: 1 }, { unique: true });
  
  const Feedback = mongoose.model("Feedback", feedbackSchema);
  