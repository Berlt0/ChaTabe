import Home from "./pages/Home"
import LoginAndCreateAccount from "./pages/LoginAndCreateAccount"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDashboard from "./pages/admin/adminDashboard"
import VerifyOTP from "./pages/otpVerification"


function Router() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginAndCreateAccount />}/>
      <Route path="/home" element={<Home/>} />
      <Route path="/admin-dashboard" element={<AdminDashboard/>} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
     

    </Routes>
  </BrowserRouter>
  )
}

export default Router
