import Conversations from "../model/conversationModel.js";
import Users from "../model/userModel.js"
import Messages from "../model/messageModel.js"


// This function handles sending message

export const sendMessage = async (req,res) => {

    if (isBlocked) {
      alert("You have blocked this user. Unblock first.");
      return;
    }
    
    try {
        
        const {senderId,receiverId, text} = req.body;

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
                conversationId:conversation._id,
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
        
        const {conversationId, senderId,receiverId} = req.body;

        if(!senderId || !receiverId) return res.status(400).json({ success: false, message: "senderId and receiverId are required" });

      
        let convoId = conversationId;

        if (!convoId) {
        const existingConvo = await Conversations.findOne({
            members: { $all: [senderId, receiverId] }
        });

        

        if (!existingConvo) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        convoId = existingConvo._id;
        }

        const messages = await Messages.find({conversationId})
        .populate("sender", "username moodStatus profilePic")
        .populate("receiver", "username moodStatus profilePic")
        .sort({createdAt: 1})

        res.status(200).json(messages)

    } catch (error) {
        console.log('Error fetching messages', error)
        res.status(500).json({success:false, message: "Something went wrong"})
    }

}


export const editMessage = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text?.trim()) {
    return res.status(400).json({ error: 'Message text cannot be empty' });
  }

  try {
    const message = await Messages.findById(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }

    message.text = text;
    message.updatedAt = new Date();

    const updatedMessage = await message.save();
    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const message = await Messages.findById(id);

    if (!message)
      return res.status(404).json({ error: "Message not found" });

    if (message.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own messages" });
    }

    // Soft delete: update instead of delete
    const updatedMessage = await Messages.findByIdAndUpdate(
      id,
      {
        text: "This message was deleted",
        isDeleted: true,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Message deleted successfully",
      messageId: id,
      newText: "This message was deleted",
      updatedMessage,
    });
  } catch (error) {
    console.log("Error deleting message: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Internal server error",
    });
  }
};




//This is responsible for finding conversations

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversations.find({
      members: { $in: [userId] },
    }).populate("members", "username profilePic moodStatus");

    // Map conversations to extract senderId and receiverId
    const formattedConversations = conversations.map((conv) => {
      const senderId = userId;
      const receiver = conv.members.find((member) => member._id.toString() !== userId);
      const receiverId = receiver ? receiver._id : null;
      const isBlocked = conv.isBlocked;
      const blockedBy = conv.blockedBy;

      return {
        conversationId: conv._id,
        senderId,
        receiverId,
        receiverInfo: receiver, 
        isBlocked,
        blockedBy
      };
    });

    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};