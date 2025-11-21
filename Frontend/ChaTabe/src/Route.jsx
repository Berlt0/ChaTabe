import Home from "./pages/Home"
import LoginAndCreateAccount from "./pages/LoginAndCreateAccount"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import confirmationModal from "./components/confirmationModal"
import AdminDashboard from "./pages/adminDashboard"

function Router() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginAndCreateAccount />}/>
      <Route path="/home" element={<Home/>} />
      <Route path="/admin-dashboard" element={<AdminDashboard/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default Router
