const mongoose = require("mongoose");


// Message Schema
const messageSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: true }
  );
  
  const Message = mongoose.model("Message", messageSchema);

  module.exports = Message;
  