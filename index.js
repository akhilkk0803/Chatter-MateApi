const mongoose = require("mongoose");
const express = require("express");
const app = express();
const { Server } = require("socket.io");

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;
  res.status(status).json({ message });
});
mongoose
  .connect(
    "mongodb+srv://akhil:akhil@cluster0.dgi9ds1.mongodb.net/chatter-mate?retryWrites=true&w=majority"
  )
  .then((res) => console.log("connected to mdb"))
  .catch((err) => console.log("error connecting to mdb"));
const server = app.listen(8080, () => {
  console.log("Server running at port 8080...");
});
const io = new Server(server, {
  cors: {
    origin: "https://chatter-mate-763ed.web.app/",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (user) => {
    socket.join(user._id);
    console.log("user connected");
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("join " + room);
  });
  socket.on("new message", (message) => {
    const chat = message.chat;
    if (!chat.user) return;
    console.log(chat.user);
    chat.user.forEach((curr) => {
      if (curr._id !== message.sender._id) {
        socket.to(curr._id).emit("message recieved", message);
      }
    });
  });
  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));
});
