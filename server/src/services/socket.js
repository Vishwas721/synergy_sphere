import { io } from 'socket.io-client';

// Initialize the socket connection
const socket = io('http://localhost:5000'); // Your backend URL

export default socket;