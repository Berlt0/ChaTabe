import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './config/db.js'
import userRoute from './route/userRoute.js'

dotenv.config()

const app = express();
app.use(bodyParser.json())

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true            
}));

const PORT = process.env.PORT || 3000;

connectDB();


app.use('/',userRoute);


app.listen(3000, () => console.log(`Server running on port ${PORT}`));

