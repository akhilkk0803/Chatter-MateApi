const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    user: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
