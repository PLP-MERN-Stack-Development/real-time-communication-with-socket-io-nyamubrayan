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

let onlineUsers = {}; // { socketId: { username, room } }

io.on("connection", (socket) => {
  console.log("🟢 A user connected", socket.id);

  // Join room
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    onlineUsers[socket.id] = { username, room };

    const usersInRoom = Object.values(onlineUsers)
      .filter(u => u.room === room)
      .map(u => u.username);

    io.to(room).emit("onlineUsers", usersInRoom);
    io.to(room).emit("notification", `${username} joined ${room}`);
  });

  // Send message
  socket.on("sendMessage", ({ room, message }) => {
    console.log("📩", message);
    const user = onlineUsers[socket.id];
    
    // Create message object with username
    const msgData = {
      user: user?.username || "Anonymous",
      text: message.text,
      time: message.time
    };
    
    // Emit to all connected clients (global)
    io.emit("receiveMessage", msgData);
  });

  // Typing indicator
  socket.on("typing", ({ room, isTyping }) => {
    if (!onlineUsers[socket.id]) return;
    socket.to(room).emit("userTyping", { user: onlineUsers[socket.id].username, isTyping });
  });

  // Private message
  socket.on("privateMessage", ({ toSocketId, message }) => {
    socket.to(toSocketId).emit("receivePrivateMessage", message);
  });

  // Disconnect
  socket.on("disconnect", () => {
    const user = onlineUsers[socket.id];
    if (user) {
      const { username, room } = user;
      delete onlineUsers[socket.id];

      const usersInRoom = Object.values(onlineUsers)
        .filter(u => u.room === room)
        .map(u => u.username);

      io.to(room).emit("onlineUsers", usersInRoom);
      io.to(room).emit("notification", `${username} has left the chat`);
      console.log("🔴 A user disconnected", socket.id);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
