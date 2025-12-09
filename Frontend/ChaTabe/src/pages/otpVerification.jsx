import React, { useState } from "react";
import axios from "../api/axiosSetup";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const email = queryParams.get("email"); 

  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/verify-otp", { email, otp });

      if (res.data.success) {
        alert("Account verified!");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  const resendOTP = async () => {   

    try {
            const res = await axios.post("/resend-otp", { email });
            alert(res.data.message);

        } catch (err) {

            alert(err.response?.data?.message || "Failed to resend OTP");

        }

  }

  return (
    <div className='h-screen bg-gradient-to-b from-white via-[#e4e4eb] to-[#2d00c2] flex items-center justify-center w-screen rounded-xl' >
        <div className="bg-white p-5 w-1/4 rounded-lg shadow-lg ">
            <ArrowLeft size={20} className="cursor-pointer text-[#6f2db7] hover:scale-110 transition-all ease-in" onClick={() => navigate('/')}/>

            <h2 className="font-semibold text-[#6f2db7] text-xl mb-10 text-center">Verify your account</h2>

            <div className="flex flex-row items-center justify-between mb-5 mx-2">

            <p className="">Email: <span className="text-[#6f2db7] italic">{email}</span></p>
            <button onClick={resendOTP} className="text-sm text-blue-500 underline hover:text-blue-700 focus:outline-none cursor-pointer transition-all ease-in">
                Resend OTP
            </button>

            </div>
        


            <form onSubmit={handleVerify} className="flex flex-col items-center justify-center">
                <input
                type="text"
                placeholder="Enter OTP"
                maxLength="6"
                value={otp}
                onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); 
                        setOtp(value);
                    }}
                className="border border-gray-300 rounded-md p-2 mb-3 w-3/4 text-center transition-all focus:outline-none focus:ring-2 focus:ring-[#6f2db7]"
                />

                <button type="submit" className="bg-[#6f2db7] py-1.5 px-3 w-2/4 rounded-md text-white cursor-pointer hover:scale-105 transition-all ease-in">Verify</button>
            </form>


        </div>
      
    </div>
  );
}
