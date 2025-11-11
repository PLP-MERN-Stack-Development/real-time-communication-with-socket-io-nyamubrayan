import { useEffect, useState } from "react";
import { io } from "socket.io-client";


const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Setup socket listeners once username is set
  useEffect(() => {
    if (!username) return;

    socket.emit("join", username);

    socket.on("receiveMessage", (msg) => {
      console.log("Received message:", msg); // Debug log
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [username]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      user: username,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    console.log("Sending message:", msgData); // Debug log
    socket.emit("sendMessage", msgData);
    setMessage("");
  };

  // Step 1: Ask for username
  if (!username) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Enter Username</h2>
        <input
          type="text"
          value={tempUsername}
          onChange={(e) => setTempUsername(e.target.value)}
          placeholder="Your name"
        />
        <button onClick={() => tempUsername.trim() && setUsername(tempUsername.trim())}>
          Join Chat
        </button>
      </div>
    );
  }

  // Step 2: Display chat
  return (
    <div style={{ padding: "20px" }}>
      <h2>💬 Global Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          height: "200px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.user}</strong> ({msg.time}): {msg.text}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
