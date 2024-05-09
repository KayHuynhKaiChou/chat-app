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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  // global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  //console.log(global.onlineUsers)

  socket.on("send-msg", (data) => {
    //console.log({ data })
    const sendUserSocket = onlineUsers.get(data.to);
    // console.log({
    //   onlineUsers : global.onlineUsers
    // })
    // console.log({
    //   idReceiver : data.to,
    //   idSockerReceiver : sendUserSocket
    // })
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive-msg");
    }
  });
});

mongoose.set('strictQuery',false);
await connect();