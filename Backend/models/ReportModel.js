const mongoose = require("mongoose");


// Report Schema
const reportSchema = new mongoose.Schema(
    {
      type: {
        type: String,
        enum: ["swap_stats", "user_activity", "feedback_logs"],
        required: true,
      },
      data: {
        type: Object,
        required: true,
      },
    },
    { timestamps: true }
  );
  
  const Report = mongoose.model("Report", reportSchema);

  module.exports = Report;