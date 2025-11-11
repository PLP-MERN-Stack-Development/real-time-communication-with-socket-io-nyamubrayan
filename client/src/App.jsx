import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [room, setRoom] = useState("general");
  const [rooms] = useState(["general", "tech", "games"]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [privateTarget, setPrivateTarget] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // Browser notification
  const notifyBrowser = (msg) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(`New message from ${msg.user}`, { body: msg.text });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification(`New message from ${msg.user}`, { body: msg.text });
        }
      });
    }
  };

  // Listen to socket events
  useEffect(() => {
    const audio = new Audio("/ping.mp3");

    socket.on("connect", () => console.log("Socket connected:", socket.id));

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      audio.play();
      if (document.hidden) setUnreadCount((prev) => prev + 1);
      notifyBrowser(msg);
    });

    socket.on("notification", (note) => setNotifications((prev) => [...prev, note]));
    socket.on("onlineUsers", (users) => setOnlineUsers(users));
    socket.on("userTyping", ({ user, isTyping }) =>
      setTypingStatus(isTyping ? `${user} is typing...` : "")
    );
    socket.on("receivePrivateMessage", (msg) =>
      alert(`Private from ${msg.user}: ${msg.text}`)
    );

    const handleVisibility = () => {
      if (!document.hidden) setUnreadCount(0);
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      socket.off("receiveMessage");
      socket.off("notification");
      socket.off("onlineUsers");
      socket.off("userTyping");
      socket.off("receivePrivateMessage");
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Join room
  useEffect(() => {
    if (!username) return;
    socket.emit("joinRoom", { username, room });
    setMessages([]);
    setNotifications([]);
  }, [username, room]);

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = { user: username, text: message, time: new Date().toLocaleTimeString() };

    if (privateTarget) {
      socket.emit("privateMessage", { toSocketId: privateTarget, message: msgData });
      alert(`Sent private message to ${privateTarget}`);
    } else {
      // Send message to selected room (global = general)
      socket.emit("sendMessage", { room, message: msgData });
    }

    setMessage("");
    socket.emit("typing", { room, isTyping: false });
  };

  // Username screen
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

  // Chat UI
  return (
    <div style={{ padding: "20px" }}>
      <h2>
        💬 Chat Room: {room} {unreadCount > 0 && `(${unreadCount} unread)`}
      </h2>

      {/* Room selection */}
      <div style={{ marginBottom: "10px" }}>
        <label>Select Room: </label>
        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          {rooms.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div
        style={{
          border: "1px solid #ccc",
          height: "250px",
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
        {notifications.map((note, i) => (
          <p key={`note-${i}`} style={{ color: "green" }}>{note}</p>
        ))}
      </div>

      <p>{typingStatus}</p>

      {/* Private target */}
      <div style={{ marginBottom: "10px" }}>
        <label>Private Message (socket ID): </label>
        <input
          type="text"
          value={privateTarget}
          onChange={(e) => setPrivateTarget(e.target.value)}
          placeholder="Enter target socket ID"
        />
      </div>

      {/* Message input */}
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          socket.emit("typing", { room, isTyping: e.target.value.length > 0 });
        }}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>

      <p>Online Users: {onlineUsers.join(", ")}</p>
    </div>
  );
}

export default App;
