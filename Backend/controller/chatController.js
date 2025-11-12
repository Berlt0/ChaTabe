import Conversations from "../model/conversationModel.js";
import Users from "../model/userModel.js"
import Messages from "../model/messageModel.js"


// This function handles sending message

export const sendMessage = async (req,res) => {
    
    try {
        
        const {conversationId, senderId,receiverId, text} = req.body;

        const sender = await Users.findById(senderId).select("username profilePic moodStatus")
        const receiver = await Users.findById(receiverId).select("username profilePic moodStatus")
        

         if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

         let conversation = await Conversations.findOne({
            members: {$all: [senderId,receiverId]}
        })

          if(!conversation){
            conversation = await Conversations.create({members: [senderId,receiverId], membersUsernames: [sender.username,receiver.username]})
            console.log("New conversation created:", conversation._id);
        }

        const message = await Messages.create(
            {
                conversationId,
                sender:senderId,
                receiver:receiverId,
                senderUsername: sender.username,
                receiverUsername: receiver.username,
                text
            })

        res.status(201).json(message)

    } catch (error) {
        
        console.log('Error Sending the Message',error)
        res.status(500).json({success:false, message: 'Something went wrong'})

    }

}

//This function handles getting or fetching all messages

export const getMessages = async (req,res) => {
    
    try {
        
        const {conversationId} = req.body;

        const messages = await Messages.find({conversationId}).populate("sender", "username profilePic").sort({createdAt: 1})

        res.status(200).json(messages)

    } catch (error) {
        console.log('Error fetching messages', error)
        res.status(500).json({success:false, message: "Something went wrong"})
    }

}

//This is responsible for finding conversations

export const getUserConversations = async (req, res) => {

  try {

    const userId = req.params.userId;
    console.log(userId)

    const conversations = await Conversations.find({ members: { $in: [userId] }, }).populate("members", "username profilePic");

    res.status(200).json(conversations);

  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};