import bcrypt from 'bcrypt'

import User from '../model/userModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js'

export const registerUser = async (req, res) => {
  try {
    const { username, password, email ,age,gender } = req.body;

    
    if (!username || !password || !email || !age || !gender) {
      return res.status(400).json({ success: false ,message: 'All fields are required' });
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false ,message: ' Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password,10);
    
    const newUser = new User({ username, email, password:hashedPassword ,age, gender});
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:true, message: 'Server error' });
  }
};


export const loginUser = async(req,res) => {

  try {

    const {username,password} = req.body;

    if(!username || !password){
      return res.status(400).json({success:false,message: 'Please enter your username and password'})
    }

    const user = await User.findOne({username})

    if(!user) {
      return res.status(401).json({success:false,message: 'Invalid crendentials'})
    }

    const isMatch = bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.status(401).json({success:false,message:"Invalid credentials"})
    }

    //Generate Tokens

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);


    //Store token in cookie

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    
    //Save refresh token in databse

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({success:true, message:'Login successful', user:{ id: user._id, username: user.username } })


  } catch (error) {
    console.error(error);
    res.status(500).json({success:true, message: 'Server error' });
  }

}

export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/', // make sure this matches the path used when setting the cookie
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};