import Home from "./pages/Home"
import LoginAndCreateAccount from "./pages/LoginAndCreateAccount"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Router() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginAndCreateAccount />}/>
      <Route path="/home" element={<Home/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default Router
