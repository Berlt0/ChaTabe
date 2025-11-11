import Users from "../model/userModel.js";
import UserMood from '../model/userMoodModel.js'

export const getUserData = async (req,res) => {
    
    try {
        
        const userId = req.user.id;

        

        const user = await Users.findById(userId).select("-password").populate("contacts", "username age gender profilePic moodStatus isActive")

        if(!user) return res.status(404).json({success:false,message:"User not found"})


        res.json({
            user,  
        });

    } catch (error) {
        
        console.error(error);
        res.status(500).json({ message: "Server error" });

    }

}