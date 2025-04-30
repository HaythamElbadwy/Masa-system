import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './Navbar.module.css';
import logo from '../../assets/Image/masa.png'
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function Navbar() {
  const [userName, setUserName] = useState("")
  const authToken = localStorage.getItem('authToken')
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => { }, [])

  function handleLogOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken")
    window.location.reload()
  }

  const adminInfo = async () => {
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/user/info?token=${authToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // body:JSON.stringify({token : authToken})
      });
      const data = await response.json();

      if (response.status === 200) {
        setUserName(data.info.name)
       
        
      } else {

        toast.error(data.message, {
          theme: 'dark'
        })
      }
    } catch (error) {
      console.error('Error during login:', error);
    } 
  };
  useEffect(() => {
    adminInfo()
  }, [])

  return (
    <nav className=" flex justify-between items-center fixed top-0 w-full z-50 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className={`${styles.logo_sidebar} rtl:justify-end ml-6`}>

        <a className="flex ms-2 md:me-24">
          <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
            <img src={logo} className='w-20' alt="" />
          </span>
        </a>

      </div>
      <div>
        <ul className='flex'>
          <li className='mx-4'>
            {accessToken == 'c3b0a9e1d5fa4c4f56e84d201d579e92' ?
              <NavLink to={'admin'} className="text-[#9B9B9B]">Admin</NavLink> :
              <p className="text-[#9B9B9B]">Admin</p>
            }
          </li>
          <li className='mx-4'>
            {accessToken == 'a3f1de57756b9cb249f5e2c7e5af957b' ?
              <NavLink to={'marketing'} className="text-[#9B9B9B]">Marketing</NavLink>
              : <p className="text-[#9B9B9B]">Marketing</p>}

          </li>

          <li className='mx-4'>
            {accessToken == 'e4b0f2c5ab1d7ef293c2f5c8e9fdc510' ?
              <NavLink to={'support'} className="text-[#9B9B9B]">Support</NavLink>
              : <p className="text-[#9B9B9B]">Support</p>}

          </li>
        </ul>
      </div>
      <div className="flex items-center mr-5">
        <div className="flex items-center ms-3">
          <h1 className={`${styles.user} font-bold mr-1`}>Hi {userName}</h1>
        </div>
        <NavLink onClick={handleLogOut} to={'/'}>
          <i class="fa-solid fa-right-from-bracket text-[#9B9B9B]"></i>
        </NavLink>

      </div>

    </nav>
  )
}
