const { Server } = require('socket.io')
const cors = require('cors');
const express = require('express');
const request = require('request')
const bodyParser = require('body-parser')
const http = require('http');
const app = express()
const server = http.createServer(app);
app.use(cors());
require('dotenv').config()
require('./db/conn').connect();
const { userModel } = require('./models/user');
const { roomModel } = require('./models/rooms');
const io = new Server(8000, {
  cors: true
})

app.use(express())
app.use(bodyParser())

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomName, userEmail) => {
    console.log({roomName, userEmail})
    if (rooms.has(roomName)) {
      console.log("this exec")
      socket.join(roomName);
      socket.to(roomName).emit('user_joined', userEmail);
    } else {
      console.log("that exec")
      rooms.set(roomName,[])
      socket.join(roomName);
      socket.emit('welcome_user', userEmail);
    }
  });

  socket.on('chat message', (message, userName, roomName) => {
    // Store the message in the room data
    const dt = new Date()
    const roomMessages = rooms.get(roomName);
    if (roomMessages) {
      roomMessages.push({ user: userName, text: message, timestamp: dt });
      rooms.set(roomName, roomMessages);
    }

    console.log(roomMessages)
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
      script: data.code,
      language: data.language,
      versionIndex: 0,
      clientId: "ed4e43f3d62e39ecd556a8e2c48d470f",
      clientSecret: "78cb7b9e32c1ae4e09a1e0bbbef278ad374623e7d8866d48279a48ac42e92c14"
    };

    request({
      url: 'https://api.jdoodle.com/v1/execute',
      method: "POST",
      json: dataSend
    }, (error, response, body) => {
      console.log('error:', error);
      socket.emit("code executed", response.body.output);
      console.log('body:', body);
    })

  });

});

const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/user', async (req, res) => {

  console.log(req.body)
  if (!req.body.email) {
    res.status(400).json({
      message: "Email is Required"
    })
    return;
  }
  try {
    const userData = await userModel.find({ email: req.body.email })
    res.status(200).json({
      user: userData
    })
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }


})

app.post('/user', async (req, res) => {


  const newUser = new userModel(req.body)

  try {
    await newUser.save();
    res.status(200).json({
      data: newUser
    })
  } catch (err) {
    res.status(400).json({
      message: err.message.includes("E11000") ? "User Already Exisits" : "All details Required"
    })
  }

})

app.post('/room/create', async (req, res) => {
  const { roomName, userEmail, roomIcon } = req.body

  const newRoom = new roomModel({
    name: roomName,
    members: [userEmail],
    icon: roomIcon
  })

  try {

    const result = await newRoom.save()

    res.status(200).json({
      data: result
    })
  } catch (err) {
    res.status(400).json({
      message: err.message.includes("E11000") ? "Room Already Exisits" : "All details Required"
    })
  }

})

app.post('/room/join', async (req, res) => {
  const { roomName, userEmail } = req.body


  try {

    const roomToJoin = await roomModel.find({ name: roomName })

    if (roomToJoin.length > 0) {
      const updatedRoom = await roomModel.updateOne({ roomName: roomName }, { members: [...roomToJoin[0].members, userEmail] })

      res.status(200).json({
        data: updatedRoom
      })

    }

  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }

})












































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


