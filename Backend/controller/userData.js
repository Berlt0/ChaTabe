import Users from "../model/userModel.js";
import UserMood from '../model/userMoodModel.js'

export const getUserData = async (req,res) => {
    
    try {
        
        const userId = req.user.id;

        

        const user = await Users.findById(userId).select("-password")

        if(!user) return res.status(404).json({success:false,message:"User not found"})

        const userMood = await UserMood.findOne({user: userId})

        res.json({
            user,   
            moodStatus: userMood ? userMood.moodStatus : null,
            isActive: userMood ? userMood.isActive : false,
        });

    } catch (error) {
        
        console.error(error);
        res.status(500).json({ message: "Server error" });

    }

}