import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer';

import User from '../model/userModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});




export const registerUser = async (req, res) => {

    try {

      const { username, password, email ,age,gender } = req.body;

      if (!username || !password || !email || !age || !gender) {
        return res.status(400).json({ success: false ,message: 'All fields are required' });
      }
      
      const otp = generateOTP();
      const otpExpires = Date.now() + 5 * 60 * 1000; 

      await transporter.sendMail({
        from: "Your App <your-email@gmail.com>",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`
      });
      
      
    
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false ,message: ' Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password,10);

      let profilePic;
    if (req.file) {
      // IMAGE PROVIDED → STORE AS BUFFER
      profilePic = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    } else {
      // NO IMAGE → USE DEFAULT URL AS STRING IN SEPARATE FIELD
      profilePic = undefined;
    }


      const newUser = new User({ username, email, password:hashedPassword ,age, gender,profilePic, otp,otpExpires,isVerified: false });
      await newUser.save();

      res.status(201).json({ success: true, message: 'User registered successfully',email });
    
    } catch (error) {

      console.error(error);
      res.status(500).json({success:false, message: 'Server error'});

    }

};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return res.status(200).json({ success: true, message: 'Account verified successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    // Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOTP;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    await user.save();

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your New OTP Code",
      text: `Your new OTP is ${newOTP}. It expires in 5 minutes.`
    });

    return res.status(200).json({ success: true, message: "OTP resent successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export const getUser = async (req, res) => {
 const user = await User.findById(req.user.id).lean();

let profilePic;

if (user.profilePic?.data) {
  // Convert buffer to Base64 string
  profilePic = `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString("base64")}`;
} else if (typeof user.profilePic === "string") {
  // Already a URL string
  profilePic = user.profilePic;
} else {
  // Fallback to default
  profilePic = user.profilePicURL;
}

user.profilePic = profilePic;

res.json({ success: true, user });
}






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

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Account not verified. Please verify OTP."
      });
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.status(401).json({success:false,message:"Invalid credentials"})
    }


    await User.findByIdAndUpdate(user._id, { 
      isActive: true,
    });

    //Generate Tokens

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);


    //Store token in cookie

    res.cookie('token', accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 1000,
      path: "/",
      
    });

    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/", 
  }); 


    
    //Save refresh token in databse

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({success:true, message:'Login successful', user:{ id: user._id, username: user.username,isAdmin:user.isAdmin } })


  } catch (error) {
    console.error(error);
    res.status(500).json({success:true, message: 'Server error' });
  }

}


export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token",expired: true });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    // Send new access token as cookie
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 15 * 60 * 1000, 
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });

  } catch (err) {
    console.log(err);
    return res.status(403).json({ success: false, message: "Expired refresh token",expired: true });
  }
};


export const logoutUser = async(req, res) => {

 try {
    const userId = req.user?.id;
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: null, isActive: false });
    }
  } catch (err) {
    console.error("Logout error:", err);
  }

  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax', path: '/' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'Lax', path: '/' });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
