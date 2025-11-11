const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("🟢 A user connected", socket.id);

  // Save username when user joins
  socket.on("join", (username) => {
    onlineUsers[socket.id] = username;
    io.emit("onlineUsers", Object.values(onlineUsers));
    io.emit("notification", `${username} has joined the chat`);
  });

  // Typing indicator
  socket.on("typing", (isTyping) => {
    socket.broadcast.emit("userTyping", { user: onlineUsers[socket.id], isTyping });
  });

  // Sending messages
  socket.on("sendMessage", (message) => {
    console.log("📩", message);
    io.emit("receiveMessage", message);
  });

  // Disconnect
  socket.on("disconnect", () => {
    const username = onlineUsers[socket.id];
    delete onlineUsers[socket.id];
    io.emit("onlineUsers", Object.values(onlineUsers));
    if(username) io.emit("notification", `${username} has left the chat`);
    console.log("🔴 A user disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
