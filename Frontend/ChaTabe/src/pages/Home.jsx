import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MessageSquareText, Smile } from "lucide-react";

axios.defaults.withCredentials = true;

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-[#ffffff] to-[#9176e8] min-h-screen">
      <header className="bg-white flex flex-row md:flex-row sm:flex-row flex-wrap justify-between items-center px-3 py-2 border-b border-gray-100 gap-2">

{/* <header className="bg-white flex flex-col md:flex-row flex-wrap justify-between items-center px-3 py-2 border-b border-gray-100 gap-2"></header> */}

        {/* LEFT - Logo */}
        <img
          src="/images.jpg"
          alt="Logo"
          className="w-14 h-10 sm:w-22 sm:h-12 md:w-[8vw] md:h-[7vh] object-cover rounded-md flex-shrink-0"
        />

        {/* CENTER - Search + Icons */}

        
        <div className="flex flex-row md:flex-row sm:flex-row items-center sm:justify-center justify-center w-[48%] sm:w-[64%] md:w-auto gap-2 md:gap-3">

          {/* Search bar */}
          <div className="flex items-center bg-gray-200 rounded-md px-2 py-1 w-[55%] sm:w-[40%] md:w-[38vw] sm:w-[20vw] border border-[#6f2db7]">

            {/* <div className="flex items-center bg-gray-200 rounded-md px-2 py-1 w-[80%] max-w-[280px] md:w-[30vw] border border-[#6f2db7]"> */}
            <Search className="text-gray-900 mr-2" size={16} />
            <input
              type="text"
              name="search"
              placeholder="Search contact"
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500 text-xs sm:text-sm text-xs"
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

        {/* RIGHT - Profile */}
        <div className="w-8 sm:w-9 md:w-10 aspect-square">
          <img
            src="/images.jpg"
            alt="User Profile Picture"
            className="w-full h-full rounded-full border-2 border-[#6f2db7] object-cover"
          />
        </div>
      </header>
    </div>
  );
};

export default Home;