Real-Time Chat Application with Socket.io
Overview

This is a real-time chat application built using Node.js, Express, React, and Socket.io.
It demonstrates bidirectional communication between clients and server, including global and room-based chat, private messaging, typing indicators, online status updates, and notifications.

The app is fully responsive, supports multiple rooms, and includes advanced real-time chat features.

Features Implemented
Core Features

Join chat with a username

Global chat in the general room

Multiple chat rooms (general, tech, games)

Display messages with sender name and timestamp

Typing indicators per room

Online/offline user tracking

Private messaging by socket ID

Advanced Features

Notifications when a user joins or leaves a room

Sound notification for new messages

Browser notifications for new messages

Unread message count per room

UX Features

Responsive UI compatible with desktop and mobile

Room selection dropdown

Easy-to-read message display with notifications

Technologies Used

Server-side: Node.js, Express, Socket.io, dotenv, cors

Client-side: React, Socket.io-client, HTML/CSS/JS

Development tools: npm, nodemon, Vite (React dev server)

Setup Instructions

Clone the repository

git clone https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-nyamubrayan.git
cd real-time-communication-with-socket-io-nyamubrayan


Install server dependencies

cd server
npm install


Install client dependencies

cd ../client
npm install


Run the development servers

Start server:

cd ../server
npm run dev


Start client:

cd ../client
npm run dev


Open your browser at http://localhost:5173

How to Use
Joining the Chat

Enter your username.

Select a room from the dropdown (general, tech, games).

Messages in the selected room appear in real-time for all connected users.

Sending Messages

Type a message in the input field and press Send.

Messages will display with the sender's name and timestamp.

Notifications and typing indicators appear in the chat.

Private Messaging

Copy the socket ID of the user you want to message.

Paste it in the Private Message (socket ID) input.

Type your message and press Send.

The target user will receive the message privately.






Online Users & Notifications

Typing Indicators

Folder Structure
real-time-communication-with-socket-io-nyamubrayan/
├─ client/             # React frontend
├─ server/             # Node.js + Socket.io backend
├─ README.md           # Project documentation
├─ Week5-Assignment.md # Assignment instructions
