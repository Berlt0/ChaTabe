
import {Trash,Pencil} from 'lucide-react'

const ChatBox = ({messages,messagesEndRef,userData,moodColorHandler,setEditingMessage, handleSelectUser,conversationId,openDeleteModal}) => {

  
  

    
  const handleEdit = (msg) => {
    setEditingMessage(msg); 
  };


   
    return (


        <div className="flex-1 overflow-y-auto p-2 mb-3 rounded-md sm:h-[70vh] md:h-[80vh] max-h-[70vh]">
          

          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isOwnMessage = msg.sender._id === userData?.user?._id;

              return (
                <div
                  key={msg._id || index}
                  ref={index === messages.length - 1 ? messagesEndRef : null}
                  className={`group p-2 my-1 rounded-lg w-fit max-w-[70%] break-words overflow-hidden ${
                    isOwnMessage
                      ? 'ml-auto text-white p-1.5 rounded-b-xl rounded-tr-none rounded-tl-xl my-2'
                      : 'mr-auto text-black flex flex-row items-center gap-2 my-2'
                  }`}
                >
                  {!isOwnMessage && msg.receiver?.profilePic ? (
                    <>
                      <img
                        src={msg.sender.profilePic}
                        alt={msg.sender.username}
                        style={{
                          borderColor: moodColorHandler(msg.sender.moodStatus),
                        }}
                        className="w-10 h-10 rounded-full object-cover border-2 shrink-0"
                      />
                      <div className={`${msg.isDeleted ? " bg-gray-500 ring-2 ring-gray-200" : "bg-red-300"} p-1.5 rounded-b-xl rounded-tl-none rounded-tr-xl break-words overflow-hidden`}>

                        <p className={`break-words ${msg.isDeleted ? "italic text-gray-300" : ""}`}>
                          {msg.isDeleted ? "This message was deleted" : msg.text}
                        </p>

                      </div>
                    </>
                  ) : (
                    <div className="group flex flex-row gap-2">
  
                      {!msg.isDeleted && (
                        <div className="invisible group-hover:visible p-1.5 flex flex-row gap-5 items-center">
                          <Trash
                            size={18.5}
                            className="cursor-pointer text-white"
                            onClick={() => {openDeleteModal(msg)}}
                          />
                          <Pencil
                            size={18.5}
                            className="cursor-pointer text-white"
                            onClick={() => handleEdit(msg)}
                          />
                        </div>
                      )}

                      <div
                        className={`${msg.isDeleted ? "bg-gray-500 ring-2 ring-gray-300" : "bg-blue-600"} p-1.5 rounded-b-xl rounded-tl-none rounded-tr-xl break-words overflow-hidden`}
                      >
                        <p className={`break-words ${msg.isDeleted ? "italic text-gray-300" : ""}`}>
                          {msg.isDeleted ? "This message was deleted" : msg.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-white/70 text-center mt-5">No messages yet</p>
          )}
        </div>



  )
}

export default ChatBox