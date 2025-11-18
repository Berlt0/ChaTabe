// ✅ Imports and setup
import axios from '../api/axiosSetup.js';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Search, MessageSquareText, Smile, ThumbsUp,MessageCircleOff,LogOut, X } from "lucide-react";
import MessageInputComponent from '../components/MessageInputComponent';
import ChatBox from '../components/chatBox';
import ConfirmationModal from '../components/confirmationModal.jsx';
import RightPanel from '../components/rightPanel.jsx';
import { io } from "socket.io-client";

// CONNECT SOCKET.IO
const socket = io("http://localhost:3000", {
  withCredentials: true
});

axios.defaults.withCredentials = true;

const Home = () => {

  const messagesEndRef = useRef(null); 

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(0);
  const [isSearching,setIsSearching] = useState(false)
  const [searchMessage,setSearchMessage] = useState(false)
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [userData,setUserData] = useState()

  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);


// ⬅ auto-scroll reference

  useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

 useEffect(() => {

  // --- receive message ---
  socket.on("receiveMessage", (data) => {
    if (data.conversationId === conversationId) {
      setMessages((prev) => [...prev, data]);
    }
  });

  // --- typing indicator ---
  socket.on("typing", (data) => {
    if (data.conversationId === conversationId) {
      setIsTyping(true);
    }
  });

  socket.on("stopTyping", (data) => {
    if (data.conversationId === conversationId) {
      setIsTyping(false);
    }
  });

  // --- cleanup on unmount ---
  return () => {
    socket.off("receiveMessage");
    socket.off("typing");
    socket.off("stopTyping");
  };

}, [conversationId]);



  useEffect(() => {
    socket.on("updateMessage", (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, text: data.text } : msg
        )
      );
    });

    return () => socket.off("updateMessage");
  }, [conversationId]);


  useEffect(() => {
    socket.on("deleteMessage", (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.filter((msg) => msg._id !== data.messageId)
        );
      }
    });

    return () => socket.off("deleteMessage");
  }, [conversationId]);


  
  useEffect(() => {
    async function fetchUserData() {
      
      try {
        
        const res = await axios.get('http://localhost:3000/user-data',{
          withCredentials: true
        })

        setUserData(res.data)
        console.log('User data: ',res.data)

      } catch (error) {
        console.error("Error fetching user data:", error);

      }

    }
 
      setTimeout(() => {
        fetchUserData(); 
    }, 100);


  },[]);


    useEffect(() => {
    if (!userId) return;
    handleSelectUser(userId);
  }, [userId]);
    

  const selectedUser = userData?.user?.contacts?.find(user => user._id === userId);
  
 

  const handleSearch = async() => {

    try {
      
      if(!query.trim()) return;

      const response = await axios.get(`http://localhost:3000/search?username=${query}`,
        {
          withCredentials: true
        }
      )

       setResults(response.data.users);

    } catch (error) {
      console.log('Somthing went wrong', error)
    }

  }

  const addContact = async (contactId) => {

    try {
      
      const response = await axios.post('http://localhost:3000/add-contact',{
        contactId
      },{ withCredentials: true})

      alert(response.message)

    } catch (error) {
      
      if(error.response) {
        alert(error.response.data.message)
        console.log('Something went wrong ', error.response )
        
      }else{
        alert('Something went wrong')
        console.log('Something went wrong ',error )
      }

    }}
    
    const Logout = async () => {

      try {
       
        await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });

        navigate('/');

      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    
    const handleSelectUser = async (receiverId) => {
      setUserId(receiverId);

      if (!receiverId || !userData?.user?._id) return;

       let findContact = null; // Declare it here

        if (userData?.user?.contacts?.length > 0) {
          findContact = userData.user.contacts.find(contact => contact._id === receiverId);
        }

        if (!findContact) return;

      try {
      
   
        const convoRes = await axios.post("http://localhost:3000/conversation", {
          senderId: userData?.user?._id,
          receiverId,
        });

        let convo;

        if (Array.isArray(convoRes.data)) {
          convo = convoRes.data.find(
            (contact) =>
              (contact.senderId === userData?.user?._id && contact.receiverId === receiverId) ||
              (contact.receiverId === userData?.user?._id && contact.senderId === receiverId)
          );
        } else {
          convo = convoRes.data;
        }

         if (!convo) {
            console.error("No conversation returned");
            return;
          }

          setConversationId(convo.conversationId);

           socket.emit("joinRoom", convo.conversationId);

      
        const messageRes = await axios.post("http://localhost:3000/messages", {
          conversationId: convo.conversationId,
          senderId: userData?.user?._id,
          receiverId
        },{withCredentials:true});

        

        setMessages(messageRes.data);
     
      } catch (error) {
        console.error("Error fetching conversation or messages:", error);
      }
    };

    const moodColorHandler = (moodStatus) => {
        if (moodStatus === 'Happy') return '#dd7c30';
        if (moodStatus === 'Sad') return '#1a4097';
        if (moodStatus === 'Angry') return '#ff3131';
        if (moodStatus === 'Annoyed') return '#049650';
        if (moodStatus === 'Afraid') return '#7228c2';
        return '#ffffffff'; 
      };    

      
      const openDeleteModal = (msg) => {
          setMessageToDelete(msg);
          setShowDeleteModal(true);
        };

    
        const closeDeleteModal = () => {
          setShowDeleteModal(false);
          setMessageToDelete(null);
        };

        const confirmDelete = async () => {
          if (!messageToDelete) return;
          console.log('Deleting message:', messageToDelete);

          try {
            await axios.delete(
              `http://localhost:3000/delete-message/${messageToDelete._id}`,
              { withCredentials: true }
            );

            socket.emit("deleteMessage", {
              conversationId,
              messageId: messageToDelete._id,
            });

            
            if (handleSelectUser) await handleSelectUser(selectedUser._id);
          } catch (error) {
            console.error("Delete failed:", error);
          } finally {
            closeDeleteModal();
          }
        };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-[#ffffff] to-[#9176e8]">

      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      )}
    
      <header className="bg-white flex flex-row flex-wrap justify-between items-center px-3 py-2 border-b border-gray-100 gap-2">

        <img
          src="/logo.png"
          alt="Logo"
          className="w-14 h-10 sm:w-22 sm:h-12 md:w-[8vw] md:h-[7vh] 2xl:w-[9vw] xl:w-[9vw] object-cover rounded-md flex-shrink-0"
        />

    
        <div className="flex flex-row items-center justify-center w-[48%] sm:w-[64%] md:w-auto gap-2 md:gap-3">
      
          <div className="flex items-center bg-gray-200 rounded-md px-2 py-1 w-[55%] sm:w-[40%] md:w-[38vw] sm:w-[20vw] 2xl:w-[25vw] border border-[#6f2db7]">
            <Search className="text-gray-900 mr-2" size={16} />
            <input
              type="text"
              name="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contact"
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500 text-xs sm:text-sm"
              onKeyDown={(e) =>{
                if(e.key === 'Enter'){
                  handleSearch()
                }
              }}

            />

            {results.length > 0 && (
              <div className="absolute bg-white rounded shadow-md mt-1 w-[200px] z-10">
                {results.map((user) => (
                  <div key={user._id} className="flex justify-between items-center p-2 border-b">
                    <p>{user.username}</p>
                    <button
                      className="bg-[#6f2db7] text-white px-2 py-1 text-xs rounded"
                      onClick={() => addContact(user._id)}>
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}


          </div>

          <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-col items-center cursor-pointer">
              <MessageSquareText className="text-[#6f2db7] block sm:hidden" size={14} />
              <MessageSquareText className="text-[#6f2db7] hidden sm:block" size={18} />
              <p className="text-[10px] text-[#6f2db7]">Chats</p>
            </div>

            <div className="flex flex-col items-center cursor-pointer">
              <Smile className="text-[#6f2db7] block sm:hidden" size={14} />
              <Smile className="text-[#6f2db7] hidden sm:block" size={18} />
              <p className="text-[10px] text-[#6f2db7]">Mood</p>
            </div>
          </div>
        </div>
            
        {userData && (

          <div className="w-8 sm:w-9 md:w-10 aspect-square">
            <img
              src={userData.user.profilePic}
              alt="User Profile Picture"
              className="w-full h-full rounded-full border-2 border-[#6f2db7] object-cover"
            />
          </div>


        )}


      </header>

      <main className="flex flex-col md:flex-row flex-grow gap-3 px-4 py-2 bg-gradient-to-r from-[#ffffff] to-[#9176e8]">
        

        <div className="bg-transparent flex-[1] 2xl:flex-[0.8] xl:flex-[0.9] lg:flex-[1.3] md:flex-[2]  min-h-[300px] md:min-h-[89vh] rounded-md shadow-md p-3 overflow-y-auto">
          <ul className="space-y-3">

            {
              
              userData?.user?.contacts?.length > 0 ? (

                userData.user.contacts.map(user => (
                  <li
                    key={user._id}
                     className={`flex items-center gap-3 p-2 rounded-md shadow-sm cursor-pointer ${
                        userId === user._id ? 'bg-[#6f2db7]' : 'bg-gray-200'
                      }`}

                    onClick={() => handleSelectUser(user._id)}
                  >
                    
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      style={{ borderColor: moodColorHandler(user.moodStatus) }}
                      className="w-10 h-10 lg:w-10 lg:h-10 rounded-full object-cover border-2"
                    />
                    <div className="flex-1">
                      <p className={`font-semibold text-sm text-gray-800 ${
                        userId === user._id ? 'text-white' : 'text-black'
                      }`}>{user.username}</p>
                      <div className="flex justify-between text-xs text-gray-500 px-1">
                        <p>{user.recentMessage}</p>
                        <p>{user.recentMessageTime}</p>
                        
                      </div>
                    </div>
                  </li>

                
              )
              )):(
                <p className='text-lg text-center'>No contacts available</p>
              )
          }
            
            
          </ul>
        </div>
          

        <div className="bg-gray-500 flex-[4] lg:flex-[3] min-h-[300px] md:min-h-[89vh] rounded-md shadow-xl flex flex-col p-2 px-3 overflow-hidden ">
          {selectedUser ? (
            <>
            
              <div className="flex flex-row gap-2 p-3">
                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.username}
                  style={{ borderColor: moodColorHandler(selectedUser.moodStatus) }}
                  className="w-14 h-14 rounded-full object-cover border-2"
                />
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-white pl-2">{selectedUser.username}</h2>
                  <p className="text-[11px] text-white pl-2">{selectedUser.moodStatus}</p>
                </div>
              </div>

        
              <div className="w-full bg-white h-[1px] my-2"></div>
        
              <ChatBox 
              messages={messages}
              messagesEndRef={messagesEndRef}
              userData={userData}
              moodColorHandler={moodColorHandler}
              setEditingMessage={setEditingMessage}
              handleSelectUser={handleSelectUser}
              conversationId={conversationId}
              openDeleteModal={openDeleteModal}
               />


              <MessageInputComponent  
                senderId={userData?.user?._id}
                receiverId={selectedUser?._id}
                senderUsername={userData?.user?.username}
                receiverUsername={selectedUser?.username}
                handleSelectUser={handleSelectUser} 
                conversationId={conversationId}
                editingMessage={editingMessage}        
                setEditingMessage={setEditingMessage}/>
              
            </>

          ) : (
            <p className="text-white text-sm p-3">Select a user to start chatting</p>
          )}
        </div>

      {/* {
        selectedUser ? (
          <>
            {isSearching ? (

              <div className="p-2 px-2 flex-1 lg:flex-[0.9] flex-shrink-0 flex-grow-0 basis-[10%] min-w-0 bg-gray-700 rounded-lg gap-5 flex flex-col">

                <div className='w-full p-2 flex flex-col gap-5'>

                  <div className='flex flex-row items-center gap-4'>

                    <X size={18} className='font-bold text-white cursor-pointer' onClick={() => setIsSearching(false)}/>
                    <p className='text-black font-bold text-white'>Search</p>
                 
                  </div>

                  
                  <div>

                    <div className='flex flex-row items-center gap-2 mb-2 '>
                      <Search size={19} className='flex-shrink-0  text-white'/>
                      <input type="text" name="search-convo" className='outline-none placeholder-white caret-white text-white' placeholder='Search in conversation'/>

                    </div>

                  </div>

                   <div className=''>
                      <li className='list-none hover:bg-gray-900 cursor-pointer'>
                        <p className='text-white'>Search Results</p>
                        
                      </li>
                      
                  </div>

                </div>

              </div>
            ) : (
              <div className="p-2 px-2 flex-1 lg:flex-[0.9] flex-shrink-0 flex-grow-0 basis-[10%] min-w-0 bg-gray-700 rounded-lg gap-5 flex flex-col">

                <div className='w-full flex flex-col items-center pt-5 gap-2'>
                  <img
                    src={selectedUser.profilePic}
                    alt={`${selectedUser.username}, Profile picture`}
                    className='w-25 h-25 lg:w-18 lg:h-18 rounded-full object-cover'
                  />
                  <h1 className='text-center text-xl text-white lg:text-lg'>
                    {selectedUser.username}
                  </h1>
                </div>

                <div className='w-full p-2 flex flex-col'>
                  <div
                    className='flex flex-row items-center gap-2 rounded py-1 px-3 cursor-pointer hover:bg-gray-900 transition duration-50 ease'
                    onClick={() => setIsSearching(true)}
                  >
                    <Search size={18} className="flex-shrink-0 lg:hidden text-white"/>
                    <Search size={16} className='flex-shrink-0 lg:block text-white'/>
                    <p className='px-2 block w-full lg:text-[0.8em] text-white'>
                      Search message
                    </p>
                  </div>

                  <div className='flex flex-row items-center gap-2 rounded py-1 px-3 cursor-pointer hover:bg-gray-900 transition duration-50 ease'>
                    <MessageCircleOff size={18} className='flex-shrink-0 lg:hidden text-white'/>
                    <MessageCircleOff size={16} className='flex-shrink-0 lg:block text-white'/>
                    <p className='px-2 w-full lg:text-[0.8em] text-white'>Block Contact</p>
                  </div>

                  <div
                    className='flex flex-row items-center gap-2 rounded py-1 px-3 cursor-pointer hover:bg-gray-900 transition duration-50 ease'
                    onClick={Logout}
                  >
                    <LogOut size={18} className='flex-shrink-0 lg:hidden text-white'/>
                    <LogOut size={16} className='flex-shrink-0 lg:block text-white'/>
                    <p className='px-2 w-full lg:text-[0.8em] text-white'>Logout</p>
                  </div>
                </div>

              </div>
            )}
          </>
        ) : (
          <></>
        )
      } */}

      <RightPanel selectedUser={selectedUser} isSearching={isSearching} setIsSearching={setIsSearching} Logout={Logout} conversationId={conversationId} moodColorHandler={moodColorHandler}/>

        
      </main>
    </div>
  );
};

export default Home;