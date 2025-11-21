import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';



import connectDB from './config/db.js'
import userRoute from './route/userRoute.js'
import adminRoute from './route/adminRoute.js'

dotenv.config()

const app = express();
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true            
}));


const PORT = process.env.PORT || 3000;

connectDB();
console.log()

const server = http.createServer(app)

const io = new Server(server, {
  cors:{
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    credentials: true

  }
})


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join conversation room
  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log("User joined room:", conversationId);
  });

  // receive message from frontend
  socket.on("sendMessage", (data) => {
    const { conversationId, message } = data;

    // send message to all users in the same room EXCEPT sender
    socket.to(conversationId).emit("receiveMessage", message);
  });


   socket.on("typing", ({ conversationId, senderId }) => {
    socket.to(conversationId).emit("typing", { senderId });
  });

  // When a user stops typing...
  socket.on("stopTyping", ({ conversationId, senderId }) => {
    socket.to(conversationId).emit("stopTyping", { senderId });
  });


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



app.use('/',userRoute);
app.use('/admin', adminRoute);  

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
