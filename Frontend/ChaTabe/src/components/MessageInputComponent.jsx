import { useState } from "react";
import { Search, MessageSquareText, Smile, ThumbsUp,MessageCircleOff,LogOut } from "lucide-react";
import axios from "axios";

//Pass the props
export const MessageInputComponent = ({senderId, receiverId,senderUsername,receiverUsername}) => {
  
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

            console.log('Message sent successfully')

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
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Input message here"
            className="p-2 outline-none w-full border border-gray-300 rounded-md placeholder-white text-white"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <ThumbsUp className="text-gray-700 cursor-pointer text-white" size={30} />

        </div>

  )
}

export default MessageInputComponent