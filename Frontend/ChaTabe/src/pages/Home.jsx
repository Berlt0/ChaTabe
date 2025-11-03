import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MessageSquareText, Smile } from "lucide-react";

axios.defaults.withCredentials = true;

const Home = () => {
  const navigate = useNavigate();
  const [data,setData] = useState([])
  const [userId,setUserId] = useState(0)

  useEffect(() => {
    axios.get('http://localhost:3000/data') // adjust port if needed
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const selectedUser = data.find(user => user.user_id === userId);


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#ffffff] to-[#9176e8]">
      
      {/* Header */}
      <header className="bg-white flex flex-row flex-wrap justify-between items-center px-3 py-2 border-b border-gray-100 gap-2">
        
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Logo"
          className="w-14 h-10 sm:w-22 sm:h-12 md:w-[8vw] md:h-[7vh] 2xl:w-[9vw] xl:w-[9vw] object-cover rounded-md flex-shrink-0"
        />

        {/* Search + Icons */}
        <div className="flex flex-row items-center justify-center w-[48%] sm:w-[64%] md:w-auto gap-2 md:gap-3">
          
          {/* Search Bar */}
          <div className="flex items-center bg-gray-200 rounded-md px-2 py-1 w-[55%] sm:w-[40%] md:w-[38vw] sm:w-[20vw] 2xl:w-[25vw] border border-[#6f2db7]">
            <Search className="text-gray-900 mr-2" size={16} />
            <input
              type="text"
              name="search"
              placeholder="Search contact"
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500 text-xs sm:text-sm"
            />
          </div>

          {/* Icon Menu */}
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

        {/* Profile */}
        <div className="w-8 sm:w-9 md:w-10 aspect-square ">
          <img
            src="/images.jpg"
            alt="User Profile Picture"
            className="w-full h-full rounded-full border-2 border-[#6f2db7] object-cover"
          />
        </div>
      </header>

  
      <main className="flex flex-col md:flex-row flex-grow gap-2 px-4 py-2 bg-gradient-to-r from-[#ffffff] to-[#9176e8] ">

        
        <div className="bg-transparent flex-1 min-h-[300px] md:min-h-[89vh] rounded-md shadow-md p-3 overflow-y-auto ">

          <ul className="space-y-3">

            {data.map(user => (

             <li key={user.user_id} className="flex items-center gap-3 bg-gray-100 p-2 rounded-md shadow-sm cursor-pointer" onClick={() => setUserId(user.user_id)}>

                <img
                  src="/images.jpg"
                  alt={user.username}
                  style={{ borderColor: user.moodColor }}
                  className="w-10 h-10 rounded-full object-cover border-2"
                />

                <div className="flex-1">

                  <p className="font-semibold text-md text-gray-800">{user.username}</p>

                  <div className="flex justify-between text-xs text-gray-500 px-1">

                    <p>{user.recentMessage}</p>
                    <p>{user.recentMessageTime}</p>

                  </div>
                </div>
                
              </li>
            
            ))}

          </ul>

        </div>

        
        
        <div className="bg-gray-700 flex-[3] min-h-[300px] md:min-h-[89vh] rounded-md p-5 shadow-xl">
          
          {
              selectedUser ? (
                <>
              <div className='flex flex-row gap-2'>
                <img
                  src='/bert.png'
                  alt={selectedUser.username}
                  style={{ borderColor: selectedUser.moodColor }}
                  className="w-14 h-14 rounded-full object-cover border-2"
                />

                <div className='flex flex-col'>
                  <h2 h2 className="text-xl font-bold text-white m-09 pl-2">{selectedUser.username}</h2>
                  <p className='text-[11px] text-white pl-2 m-0 '>{selectedUser.moodStatus}</p>
                </div>


              </div>

              <div className='w-full bg-white p-[.5px] mt-5'></div>
              </>
            ) : (
                <p className="text-white text-sm">Select a user to start chatting</p>
            )
          
          }



        </div>
      </main>
    </div>
  );
};

export default Home;