import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";
import connect from "./config/mongoDB/index.js";
import { routes } from "./routes/index.js";
import {Server} from 'socket.io';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

routes(app)

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on http://localhost:${process.env.PORT}`)
);

// apply socket.io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    credentials: true,
  }
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  // global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    const onlineUserObjs = Object.fromEntries(onlineUsers)
    // Phát sự kiện đến tất cả các socket, bao gồm cả socket hiện tại
    io.emit('get-users-online', Object.keys(onlineUserObjs))
  });
  //console.log(global.onlineUsers)

  socket.on("send-msg", (idReceiver, sentMessage) => {
    const sendUserSocket = onlineUsers.get(idReceiver);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive-msg" , sentMessage);
    }
  });

  socket.on("disconnect", () => {
    // Tìm user đã ngắt kết nối và xóa khỏi onlineUsers
    for (let [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    
    const onlineUserObjs = Object.fromEntries(onlineUsers)
    // Phát sự kiện đến tất cả các socket, bao gồm cả socket hiện tại
    io.emit('get-users-online', Object.keys(onlineUserObjs))
  })
});

mongoose.set('strictQuery',false);
await connect();