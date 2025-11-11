import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

 const sendMessage = () => {
  if (message.trim() === "") return;
  
  const msgData = {
    user: username,
    text: message,
    time: new Date().toLocaleTimeString()
  };

  socket.emit("sendMessage", msgData);
  setMessage("");
};

const [username, setUsername] = useState("");

if (!username) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Enter Username</h2>
      <input type="text" onBlur={(e) => setUsername(e.target.value)} placeholder="Your name" />
      <p>(Click out of the box to continue)</p>
    </div>
  );
}



  return (
    <div style={{ padding: "20px" }}>
      <h2>💬 Lets Chat</h2>

      <div style={{ border: "1px solid #ccc", height: "200px", overflowY: "auto", padding: "10px", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
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
