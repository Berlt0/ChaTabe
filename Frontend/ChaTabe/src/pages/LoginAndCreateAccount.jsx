import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

//Include tokens every req

axios.defaults.withCredentials = true


const Login = () => {
  const navigate = useNavigate()

  const [isLoginPage,setIsLoginPage] = useState(true);

  //Holds data when the user login

  const [loginUsername,setLoginUsername] = useState("");
  const [loginPassword,setLoginPassword] = useState("");

  //Holds data for registration

  const [registerUsername,setRegisterUsername] = useState("");
  const [registerEmail,setRegisterEmail] = useState('')
  const [registerPassword,setRegisterPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [age,setAge] = useState(0)
  const [gender,setGender] = useState('')
  

  const handleRegister = async (e) =>{
    e.preventDefault();

    if (!registerUsername || !registerPassword || !registerEmail || !age || !gender) {
      alert("Please fill all fields");
      return;
  }

    if (registerPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
  }

    try {
      const response = await axios.post(`http://localhost:3000/register`, {
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        age: Number(age),
        gender: gender.trim()
      });

      console.log("Registered Successfully",response.message);

      alert('Registered Successfully')
      setRegisterUsername('')
      setRegisterPassword('')
      setConfirmPassword('')
      setRegisterEmail('')
      setGender('')
      setAge(0)


    } catch (error) {
      console.error('Something went wrong',error);
      alert(error.response?.data?.message || 'Something went wrong');
    }

  };


  const handleLogin = async(e) =>{
    e.preventDefault()

    try {

      if(!loginUsername || !loginPassword){
        alert('Please Enter you username and password')
        return
      }

      const response = await axios.post(`http://localhost:3000/login`,{
        username:loginUsername,
        password:loginPassword
      });

      setLoginUsername('')
      setLoginPassword('')

      console.log(response.message)
      navigate('/home')

      


    } catch (error) { 
      console.log('Something went wrong',error);
      alert('Invalid credentials')
      
    }

  }
  
  return (
    <div className='h-screen bg-gray-600 flex items-center justify-center w-screen'>
      {
      (isLoginPage)?(

        <div className='bg-transparent mx-auto  p-6 w-8/12 sm:w-2/4 md:w-1/3 lg:w-2/6 xl:w-2/6 2xl:w-[20%]  shadow-2xl'>
            <h1 className='text-4xl font-bold text-center text-white mb-3 2xl:text-3xl'>Login</h1>
            <p className='text-center text-white text-sm mb-3 2xl:text-base 2xl:mb-4'>Don't have an account? <span className='text-yellow-500 cursor-pointer underline' onClick={() => setIsLoginPage(false)}>Create Account</span></p>

            <form className='flex flex-col'>

                <label className='text-white mb-1 2xl:text-base 2xl:mb-2'>Username:</label>

                <input type="text" 
                name="login-username" 
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder='Enter your Username' 
                className='bg-gray-300 px-3 py-2 mb-3 outline-none rounded-xl text-black 2xl:mb-4 2xl:py-3 2xl:text-sm'/>

                <label className='text-white mb-1 2xl:text-base 2xl:mb-2.5'>Password:</label>

                <input type="password" 
                name="login-password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder='Enter your Password' 
                className='bg-gray-300 px-3 py-2 outline-none rounded-xl text-black mb-4 2xl:py-3 2xl:mb-5 2xl:text-sm'/>

                <button className='py-1.5 border-1 rounded-xl text-white cursor-pointer 2xl:py-2' onClick={handleLogin}>Login</button>

            </form>
            
        </div>

      ):(

         <div className='bg-transparent mx-auto  p-6 w-8/12 sm:w-2/4 md:w-1/3 lg:w-2/6 xl:w-2/6 2xl:w-[20%]  shadow-2xl'>
            <h1 className='text-4xl font-bold text-center text-white mb-3 2xl:text-3xl'>Create Account</h1>
            <p className='text-center text-white text-sm mb-3 2xl:text-base 2xl:mb-4'>Already have an account? <span className='text-yellow-500 cursor-pointer underline' onClick={() => setIsLoginPage(true)}>Login in here</span></p>

            <form className='flex flex-col'>

                    <label className='text-white mb-1'>Username:</label>

                    <input type="text" 
                    name="registerUsername" 
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder='Enter your username' 
                    className='bg-gray-300 px-3 py-2 mb-3 outline-none rounded-xl text-black'/>

               

                <div className='flex flex-row justify-start gap-5'>

                  <div className='flex flex-col'>

                    <label className='text-white mb-1'>Age:</label>

                    <input type='number' 
                    name="register-age" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    placeholder='Enter your Age' 
                    className='bg-gray-300 px-3 py-2 mb-3 outline-none rounded-xl text-black w-full'/>

                  </div>
                  
                <div className="flex flex-col ">
                  <label className="text-white mb-1">Gender:</label>
                  <div className="flex flex-row gap-4 text-white ">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={gender === "Male"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      Male
                    </label>

                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={gender === "Female"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      Female
                    </label>
                  </div>
                </div>

                </div>

             
                
                <label className='text-white mb-1'>Email:</label>

                <input type="email" 
                name="register-email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}  
                placeholder='Enter your Email' 
                className='bg-gray-300 px-3 py-2 outline-none rounded-xl text-black mb-4 '/>

                <label className='text-white mb-1'>Password:</label>

                <input type="password" 
                name="register-password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)} 
                placeholder='Enter your Password'   
                className='bg-gray-300 px-3 py-2 outline-none rounded-xl text-black mb-4 '/>


                <label className='text-white mb-1'>Confirm Password:</label>

                <input type="password" 
                name="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder='Confirm your password' 
                className='bg-gray-300 px-3 py-2 outline-none rounded-xl text-black mb-4 '/>

                <button className='py-1.5 border-1 rounded-xl text-white cursor-pointer' onClick={handleRegister}>Submit</button>

            </form>
            
        </div>

      )

    }

    </div>
  )
}

export default Login