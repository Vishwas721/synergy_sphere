const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http'); // 1. Import http
const { Server } = require("socket.io"); // 2. Import Server from socket.io
const userRoutes = require('./src/routes/userRoutes');
const app = express();
const server = http.createServer(app); // 3. Create an http server with the express app

// 4. Initialize socket.io with CORS configured for your React app
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app's URL
    methods: ["GET", "POST"]
  }
});

// Store connected users
let onlineUsers = {};

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // When a user logs in, they should join a room named after their user ID
  socket.on('join_room', (userId) => {
    socket.join(userId);
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on('disconnect', () => {
    // Clean up on disconnect
    for (const [userId, socketId] of Object.entries(onlineUsers)) {
        if (socketId === socket.id) {
            delete onlineUsers[userId];
            break;
        }
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Middleware & Routes (existing code)
app.use(cors());
app.use(express.json());
// Add `io` to the request object so controllers can access it
app.use((req, res, next) => {
  req.io = io;
  next();
});

const authRoutes = require('./src/routes/authRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const tagsRoutes = require('./src/routes/tagsRoutes');

// ... (app.use for other routes)
app.use('/api/tags', tagsRoutes);
// We will create notification routes next
// const notificationRoutes = require('./src/routes/notificationRoutes'); 
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
// app.use('/api/notifications', notificationRoutes);


// 5. Start the server using server.listen() instead of app.listen()
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});