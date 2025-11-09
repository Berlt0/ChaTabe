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

const server = http.createServer(app)

const io = new Server(server, {
  cors:{
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','PATCH','DELETE']
  }
})



app.use('/',userRoute);


app.listen(3000, () => console.log(`Server running on port ${PORT}`));

