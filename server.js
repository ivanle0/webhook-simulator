// Webhook simulation project using Node.js, Express, Socket.io
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



// Webhook Receiver endpoint
app.post('/webhook', (req, res) => {
  const message = req.body.message;
  console.log('Webhook received:', message);
  // Emit the message to user interface
  io.emit('push-message', message);
  res.sendStatus(200);
});



// Webhook Sender endpoint
// Simulates sending a webhook from the server
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
