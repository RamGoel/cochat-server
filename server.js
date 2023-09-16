const { Server } = require('socket.io')
const cors = require('cors');
const express = require('express');
const request=require('request')
require('dotenv').config()
const http = require('http');
const app=express()
const server = http.createServer(app);
app.use(cors());
const { connect } = require('./db/conn')
connect()
const io = new Server(8000, {
    cors:true
})

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomName, userName) => {
    console.log(roomName)
    // Join a specific room
    socket.join(roomName);

    // Store the room data if it doesn't exist
    if (!rooms.has(roomName)) {
      rooms.set(roomName, []);
    }

    console.log(rooms)

    // // Send the existing messages in the room to the connected user
    socket.emit('room messages', rooms.get(roomName));

    // // Notify other users in the room that a new user has joined
    socket.to(roomName).emit('user joined', userName);

    // // Broadcast the updated list of connected users in the room
    // const usersInRoom = Object.keys(io.sockets.adapter.rooms[roomName].sockets);
    // io.in(roomName).emit('users in room', usersInRoom);
  });

  socket.on('chat message', (message, userName, roomName) => {
    // Store the message in the room data
    const dt=new Date()
    const roomMessages = rooms.get(roomName);
    if (roomMessages) {
      
      roomMessages.push({ user: userName, text: message, timestamp:dt });
      rooms.set(roomName, roomMessages);
    }

    console.log(rooms)
    // Broadcast the message to all users in the room
    io.in(roomName).emit('chat message', { user: userName, text: message });
  });

  socket.on('disconnect', () => {
    // Leave all rooms the user was in
    const roomsJoined = Object.keys(socket.rooms);
    roomsJoined.forEach((room) => {
      socket.to(room).emit('user left', socket.id);
      // const usersInRoom = Object.keys(io.sockets.adapter.rooms[room].sockets);
      // io.in(room).emit('users in room', usersInRoom);
    });
    console.log('User disconnected:', socket.id);
  });
  socket.on('code exec', (data) => {
    console.log(data)


  var dataSend = {
      script : data.code,
      language: data.language,
      versionIndex:0,
      clientId: "ed4e43f3d62e39ecd556a8e2c48d470f",
      clientSecret:"78cb7b9e32c1ae4e09a1e0bbbef278ad374623e7d8866d48279a48ac42e92c14"
    };

  request({
      url: 'https://api.jdoodle.com/v1/execute',
      method: "POST",
      json: dataSend
  },(error, response, body)=>{
      console.log('error:', error);
      socket.emit("code executed",response.body.output);
      console.log('body:', body);
  })
    
      });

});

const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// socket.on('checkEmotion',async(data)=>{
//   const axios = require("axios");

// const encodedParams = new URLSearchParams();
// encodedParams.append("text", data.text);

// const options = {
// method: 'POST',
// url: 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/',
// headers: {
// 'content-type': 'application/x-www-form-urlencoded',
// 'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com',
// 'X-RapidAPI-Key': '710d6e061dmsh98b84ba69026524p1b8a91jsnc9f00a492a48'
// },
// data: encodedParams
// };

// axios.request(options).then(function (response) {
// console.log(response.data);
// }).catch(function (error) {
// console.error(error);
// });
// })