const Chat = require("../models/chatModel");
function generateError(msg, code) {
  const error = new Error(msg);
  error.statusCode = code;
  throw error;
}
exports.addChat = async (req, res, next) => {
  const { receiver } = req.body;
  console.log(receiver);
  if (!receiver) {
    generateError("No user selected", 404);
  }
  const chat = await Chat.findOne({
    isGroupChat: false,
    user: { $all: [receiver, req.userId] },
  })
    .populate("user")
    .populate("latestMessage");
  if (!chat) {
    const chat = await Chat.create({
      chatName: "sender",
      user: [receiver, req.userId],
    });
    const result = await chat.populate("user");
    res.json(result);
  } else res.json(chat);
};
exports.getChat = async (req, res, next) => {
  let chat = await Chat.find({ user: req.userId })
    .populate("user")
    .populate({
      path: "latestMessage",
      populate: { path: "sender" },
    })
    .populate("groupAdmin")
    .sort({ updatedAt: -1 });
  res.json(chat);
};
exports.createGroup = async (req, res, next) => {
  const { users, chatName } = req.body;
  console.log(users, chatName);
  try {
    if (!users || !chatName) {
      generateError("Enter all details", 400);
    }
    users.push(req.userId);
    const group = await Chat.create({
      isGroupChat: true,
      user: users,
      chatName,
      groupAdmin: req.userId,
    });
    const result = await group.populate("user");
    const ans = await result.populate("groupAdmin");
    res.json(ans);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};
exports.renameGroup = async (req, res, next) => {
  const { chatId, chatName } = req.body;
  console.log(chatId, chatName);
  const chat = await Chat.findByIdAndUpdate(chatId, { chatName: chatName });

  res.json(chat);
};
exports.addTogroup = async (req, res, next) => {
  const { chatId, user } = req.body;
  console.log(chatId, user);
  try {
    const exsits = await Chat.findOne({ _id: chatId, user: user });
    if (exsits) {
      console.log(exsits);
      generateError("Already exsist in the group", 403);
    }
    const group = await Chat.findByIdAndUpdate(chatId, {
      $push: {
        user: user,
      },
    });
    res.json(group);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};
exports.removeFromgroup = async (req, res, next) => {
  const { chatId, user } = req.body;
  try {
    const group = await Chat.findByIdAndUpdate(chatId, {
      $pull: {
        user: user,
      },
    });
    res.json(group);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};
