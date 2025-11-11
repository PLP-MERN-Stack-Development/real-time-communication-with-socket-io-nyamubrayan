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

io.on("connection", (socket) => {
  console.log("🟢 A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected", socket.id);
  });

socket.on("sendMessage", (message) => {
  console.log("📩", message);
  io.emit("receiveMessage", message);
});


});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
