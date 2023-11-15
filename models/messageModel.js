const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    content: String,
    chat: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
