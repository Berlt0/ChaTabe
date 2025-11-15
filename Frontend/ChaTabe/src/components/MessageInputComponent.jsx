import { useState } from "react";
import { Search, MessageSquareText, Smile, ThumbsUp,MessageCircleOff,LogOut } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";


// Initialize socket
const socket = io("http://localhost:3000", {
    withCredentials: true
});

let typingTimeout = null;


//Pass the props
export const MessageInputComponent = ({senderId, receiverId,senderUsername,receiverUsername, handleSelectUser,conversationId}) => {
  
    const [message,setMessage] = useState('')


    const sendMessage = async () => {


        try {

            if(!message.trim()) return

            if(!senderId || !receiverId){
                console.log('Missing sender or receiver ID')
                return
            }

        
            
            const response = await axios.post('http://localhost:3000/send-message',{
                
                senderId: senderId,
                receiverId: receiverId,
                senderUsername: senderUsername,
                receiverUsername: receiverUsername,
                text:message,
            }
            ,{withCredentials:true})

              const savedMessage = response.data;

                // 🔥 SEND REAL-TIME MESSAGE OVER SOCKET.IO
                socket.emit("sendMessage", {
                    conversationId: savedMessage.conversationId,
                    message: savedMessage
                });

                 socket.emit("stopTyping", { conversationId, senderId });

            console.log('Message sent successfully')

              if (handleSelectUser) {
                await handleSelectUser(receiverId);
            }

            setMessage('')

        } catch (error) {
            
            console.log('Error sending data',error)

        }





    }
  
    return (
   
        <div className="p-2 w-full flex flex-row gap-3 items-center rounded-md">

            <input
            type="text"
            name="input_message"
            value={message}
            onChange={(e) => {
                setMessage(e.target.value)
                
                
                socket.emit("typing", {
                    conversationId,
                    senderId
                });

                if (typingTimeout) clearTimeout(typingTimeout);

                typingTimeout = setTimeout(() => {
                    socket.emit("stopTyping", {
                        conversationId,
                        senderId
                    });
                }, 1200); 
                        
            
            }}
            placeholder="Input message here"
            className="p-2 outline-none w-full border border-gray-300 rounded-md placeholder-white text-white"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <ThumbsUp className="text-gray-700 cursor-pointer text-white" size={30} onClick={sendMessage}/>

        </div>
    
  )
}

export default MessageInputComponent