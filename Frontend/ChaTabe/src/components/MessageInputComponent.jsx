import { useState,useEffect } from "react";
import { Search, MessageSquareText, Smile, ThumbsUp,MessageCircleOff,LogOut,X } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";



// Initialize socket
const socket = io("http://localhost:3000", {
    withCredentials: true
});

let typingTimeout = null;


//Pass the props
export const MessageInputComponent = ({senderId, receiverId,senderUsername,receiverUsername, handleSelectUser,conversationId, editingMessage,   setEditingMessage}) => {
  
    const [message,setMessage] = useState('')
    const [inputText, setInputText] = useState('');
    const [isClose,setIsClose] = useState(true)

    useEffect(() =>{

        if(editingMessage){
            setInputText(editingMessage.text)
        }else{
            setInputText('')
        }

    },[editingMessage])


    const sendMessage = async () => {


        try {

            if(!inputText.trim()) return

            if(!senderId || !receiverId){
                console.log('Missing sender or receiver ID')
                return
            }

        
            
            const response = await axios.post('http://localhost:3000/send-message',{
                
                senderId: senderId,
                receiverId: receiverId,
                senderUsername: senderUsername,
                receiverUsername: receiverUsername,
                text:inputText,
            }
            ,{withCredentials:true})

              const savedMessage = response.data;

                // SEND REAL-TIME MESSAGE OVER SOCKET.IO
                socket.emit("sendMessage", {
                    conversationId: savedMessage.conversationId,
                    message: savedMessage
                });

                 socket.emit("stopTyping", { conversationId, senderId });

            console.log('Message sent successfully')

              if (handleSelectUser) {
                await handleSelectUser(receiverId);
            }

            setInputText('')

        } catch (error) {
            
            console.log('Error sending data',error)

        }

    }


    const editExistingMessage = async () => {
        
        if (!inputText.trim() || !editingMessage) return;
        console.log(editingMessage._id)

        try {
        const response = await axios.put(
            `http://localhost:3000/edit-message/${editingMessage._id}`,
            { text: inputText },
            { withCredentials: true }
        );

        socket.emit("updateMessage", {
            conversationId,
            messageId: editingMessage._id,
            text: message,
        });

        setEditingMessage(null);
        setInputText("");

        
        if (handleSelectUser) await handleSelectUser(receiverId);

        } catch (err) {
        console.error("Error editing message:", err);
        }
    };


    const handleSubmit = () => {
        if (editingMessage) {
        editExistingMessage();
        } else {
        sendMessage();
        }
    };

  

    const cancelEdit = () => {
        setEditingMessage(null);
        setIsClose(true);
        setMessage("");
    };


    const handleTyping = (e) => {
        setInputText(e.target.value);

        socket.emit("typing", { conversationId, senderId });

        if (typingTimeout) clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", { conversationId, senderId });
        }, 1200);
  };

  
   return (
    <div className="relative p-1 w-full mt-2">
      
        {editingMessage && (
        <div className="absolute left-0 right-0 -top-10 bg-gray-100 text-black text-sm font-medium px-3 py-2 pr-3 ml-1 mr-14 rounded-t-md flex items-center justify-between z-10 animate-in slide-in-from-top duration-200">
            <span>Edit message</span>
            <X
            size={21}
            className="cursor-pointer hover:bg-gray-500 p-1 hover:text-white hover:rounded-xl transition-all"
            onClick={cancelEdit}
            />
        </div>
        )}

  
        <div className="flex items-center gap-5">
        <input
            type="text"
            value={inputText}
            onChange={handleTyping}
            onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape" && editingMessage) cancelEdit();
            }}
            placeholder={editingMessage ? "Edit message…" : "Input message here"}
            className={`
            flex-1 p-3 rounded-md outline-none
            bg-gray-700 text-white placeholder-gray-400
            border ${editingMessage ? "border-gray-300" : "border-gray-600"}
            focus:border-blue-500 transition-colors
            `}
        />

        <ThumbsUp
            className="text-white cursor-pointer hover:text-green-400 transition-colors"
            size={30}
            onClick={handleSubmit}
        />
        </div>
    </div>
);
}

export default MessageInputComponent