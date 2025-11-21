import React, { useEffect, useState } from "react";
import axios from "../api/axiosSetup";
import { useNavigate } from "react-router-dom";
import { Users, MessageSquare, Shield, LogOut, Activity, Ban, Send } from "lucide-react";

const AdminDashboard = () => {

    const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [totalMessageSentToday,setTotalMessageSentToday] = useState(0)
  const [messages, setMessages] = useState([]);
  

  const fetchData = async () => {

    try {

        const responses = await Promise.all([

          axios.get("http://localhost:3000/admin/total-users"),
          axios.get("http://localhost:3000/admin/total-messages"),
          axios.get("http://localhost:3000/admin/total-admins"),
          axios.get("http://localhost:3000/admin/active-users"),
          axios.get("http://localhost:3000/admin/messages-today")

        ])

  
        setTotalUsers(responses[0].data.totalUsers );
        setTotalMessages(responses[1].data.totalMessages );
        setTotalAdmins(responses[2].data.totalAdmins );
        setTotalActiveUsers(responses[3].data.activeUsers );
        setTotalMessageSentToday(responses[4].data.messagesToday)

    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:3000/logout",{withCredentials:true});
    navigate("/");
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex bg-gray-100 min-h-screen">

      
      <aside className="w-60 bg-white shadow-md p-5 fixed h-full">
        <h1 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h1>
        
        <nav className="flex flex-col gap-4">
          <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 cursor-pointer">
            <Users size={20} /> Users
          </button>
          <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 cursor-pointer">
            <MessageSquare size={20} /> Messages
          </button>
          <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 cursor-pointer">
            <Shield size={20} /> Security
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-700 mt-10 cursor-pointer"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>


      <main className="ml-64 p-5 ">

       
        <header className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">
            Dashboard Overview
          </h2>
          <p className="text-gray-500">Monitor users and messages in real-time</p>
        </header>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                
                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>

                <div className="p-3 bg-blue-100 rounded-full">
                    <Users size={24} className="text-blue-600" />
                </div>
              </div>
              
                <p className="text-4xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-sm text-gray-500 mt-2">All registered users</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">

                <h3 className="text-lg font-semibold text-gray-700">Total Messages</h3>

                <div className="p-3 bg-green-100 rounded-full">
                    <MessageSquare size={24} className="text-green-600" />
                </div>
              </div>

                <p className="text-4xl font-bold text-gray-900">{totalMessages}</p>
                <p className="text-sm text-gray-500 mt-2">Across all chats</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300">
                <div className="flex justify-between items-center mb-2">

                <h3 className="text-lg font-semibold text-gray-700">Admin Users</h3>

                <div className="p-3 bg-purple-100 rounded-full">
                    <Shield size={24} className="text-purple-600" />
                </div>
                </div>

                <p className="text-4xl font-bold text-gray-900">{totalAdmins}</p>
                <p className="text-sm text-gray-500 mt-2">Privileged accounts</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300">
                <div className="flex justify-between items-center mb-2">

                <h3 className="text-lg font-semibold text-gray-700">Message Sent Today</h3>
                <div className="p-3 bg-indigo-100 rounded-full">

                    <Send size={24} className="text-indigo-600" />
                </div>
                </div>

                <p className="text-4xl font-bold text-gray-900">{totalMessageSentToday}</p>
                <p className="text-sm text-gray-500 mt-2">All conversation</p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300">
                <div className="flex justify-between items-center mb-2">
                  
                <h3 className="text-lg font-semibold text-gray-700">Active Users Today</h3>

                <div className="p-3 bg-green-100 rounded-full">
                    <Activity size={24} className="text-lime-600" />
                </div>
                </div>

                <p className="text-4xl font-bold text-gray-900">{totalActiveUsers}</p>
                <p className="text-sm text-gray-500 mt-2">Currently online</p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300">
                <div className="flex justify-between items-center mb-2">

                <h3 className="text-lg font-semibold text-gray-700">Banned Users</h3>

                <div className="p-3 bg-red-100 rounded-full">
                    <Ban size={24} className="text-red-600" />
                </div>
                </div>

                <p className="text-4xl font-bold text-gray-900">{}</p>
                <p className="text-sm text-gray-500 mt-2">Currently banned</p>
            </div>


            </div>

        

      </main>
    </div>
  );
};

export default AdminDashboard;
