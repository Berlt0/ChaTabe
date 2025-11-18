import { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Search, MessageCircleOff, LogOut } from "lucide-react";

const RightPanel = ({ selectedUser, isSearching, setIsSearching, Logout, conversationId,moodColorHandler }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchHandler = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/search-message', {
        message: searchQuery.trim(),
        conversationId
      }, { withCredentials: true });

      setSearchResults(response.data.results || []);
    } catch (error) {
      console.log("Search error:", error.response?.data || error.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // This runs every time searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);   // Clear results when input is empty
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();        // Prevent form submit / newline
      searchHandler();
    }
    if (e.key === 'Escape') {
      setIsSearching(false);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  return (
    <>
      {selectedUser ? (
        <>
          {isSearching ? (
            <div className="flex flex-col flex-1 lg:flex-[0.9] min-w-0 basis-[10%] bg-gray-700 rounded-lg overflow-hidden">

              {/* Header */}
              <div className="flex items-center gap-4 p-4 border-b border-gray-600">
                <X 
                  size={22} 
                  className='text-white cursor-pointer hover:text-gray-300' 
                  onClick={() => {
                    setIsSearching(false);
                    setSearchResults([]);
                    setSearchQuery('');
                  }} 
                />
                <p className='text-white font-semibold text-lg'>Search Messages</p>
              </div>

            
              <div className="p-4">
                <div className='flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-2'>
                  <Search size={20} className='text-gray-400' />
                  <input 
                    type="text" 
                    className='flex-1 bg-transparent outline-none text-white placeholder-gray-400 caret-purple-500'
                    placeholder='Search in conversation...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </div>
              </div>

        
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {isLoading ? (
                  <p className="text-center text-gray-400 mt-8">Searching...</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-center text-gray-400 mt-8">
                    {searchQuery.trim() ? "No messages found" : "Type something to search"}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((msg) => (
                      <div
                        key={msg._id}
                        className="bg-gray-800/50 backdrop-blur rounded-lg p-4 hover:bg-gray-750 transition cursor-pointer border border-gray-700"
                        onClick={() => {
                          console.log("Jump to message:", msg._id);
                          // Later: scroll to this message
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                            {msg.sender?.username?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-300">
                              {msg.sender?.username || 'Unknown User'}
                            </p>
                            <p className="text-white text-sm mt-1 break-words line-clamp-2">
                              {msg.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(msg.createdAt).toLocaleString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            
            <div className="p-6 flex flex-col flex-1 lg:flex-[0.9] min-w-0 basis-[10%] bg-gray-700 rounded-lg gap-6">

              <div className='flex flex-col items-center gap-4'>

                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.username}
                  style={{borderColor:moodColorHandler(selectedUser.moodStatus)}}
                  className='w-20 h-20 rounded-full object-cover border-4 '/>

                <h1 className='text-2xl font-bold text-white'>{selectedUser.username}</h1>

              </div>

              <div className='flex flex-col gap-1 mt-3'>

                <button onClick={() => setIsSearching(true)} className='flex items-center gap-4 rounded-lg py-2 px-5 hover:bg-gray-600 transition text-white text-left cursor-pointer'>
                  <Search size={20} />
                  <span className="font-sm">Search in chat</span>
                </button>

                <button className='flex items-center gap-4 rounded-lg py-2 px-5 hover:bg-gray-600 transition text-white text-left cursor-pointer'>
                  <MessageCircleOff size={20} />
                  <span className="font-sm">Block Contact</span>
                </button>

                <button onClick={Logout} className='flex items-center gap-4 rounded-lg py-2 px-5 hover:bg-red-600/30 transition text-white text-left cursor-pointer'>
                  <LogOut size={20} />
                  <span className="font-sm">Logout</span>
                </button>

              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
};

export default RightPanel;