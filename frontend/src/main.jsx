import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './Pages/Login.jsx'
import SignUp from './Pages/SignUp.jsx'
import ForgetPassword from './Pages/ForgotPassword.jsx'
// import App from './App'


const router = createBrowserRouter(createRoutesFromElements(
  <>
  <Route path="/login" element={<Login />} /> 
  <Route path="/signup" element={<SignUp />} />
  <Route path="/forgot-password" element={<ForgetPassword />} />
  </>
))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} /> 
    {/* <App /> */}
  </React.StrictMode>

)
