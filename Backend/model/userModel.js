import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },isAdmin:{
        type: Boolean,
        default: false
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        required: false
    
    },moodStatus:{
        type: String,
        required: true
    },isActive:{
        type: Boolean,
        required: true
    },contacts: [

        {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'  // Reference to other users
    },]
    ,refreshToken: {
        type: String,
        default: null
    }
})

export default mongoose.model("Users", userSchema)