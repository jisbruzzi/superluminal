const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
var cors = require('cors')
app.use(cors())
const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000"
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});