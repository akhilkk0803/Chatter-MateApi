const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
exports.addChat = async (req, res, nex) => {
  const { msg, chatId } = req.body;
  if (!msg || !chatId) {
    const err = new Error("Data not found");
    err.statusCode = 400;
    throw err;
  }
  const data = {
    content: msg,
    chat: chatId,
    sender: req.userId,
  };
  try {
    let result = await Message.create(data);
    result = await result.populate("sender");
    result = await result.populate("chat");
    result = await result.populate({
      path: "chat.user",
      select: "name email _id",
    });
    await Chat.findByIdAndUpdate(result.chat._id, {
      latestMessage: result._id,
    });
    res.json(result);
  } catch (error) {}
};
exports.getChat = async (req, res, next) => {
  const { chatId } = req.params;
  const msgs = await Message.find({ chat: chatId })
    .sort({ updatedAt: -1 })
    .populate("sender", "name pic email");
  res.json(msgs);
};
