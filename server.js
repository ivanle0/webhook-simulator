// Webhook simulation project using Node.js, Express, Socket.io

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// Need to create HTTP server to use with Socket.io
// this is necessary to handle HTTP requests and WebSocket connections
const server = http.createServer(app);   
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Webhook Receiver endpoint
app.post('/webhook', (req, res) => {
  const message = req.body.message;
  if (!message || typeof message !== 'string') {
    console.log('Invalid webhook payload:', req.body);
    return res.status(400).json({ error: 'Invalid payload.' });
  }
  console.log('Webhook received:', message);
  // Emit to user interface
  io.emit('push-message', message);
  res.sendStatus(200);
});



// Webhook Sender endpoint
app.get('/send-webhook/:msg', async (req, res) => {
  const message = req.params.msg;

  await fetch('http://localhost:3000/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  res.send('Webhook sent');
});



// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');

  // Listen for messages from the client
  socket.on('client-message', (msg) => {
    console.log('Message from client:', msg);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
