import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './Admin.module.css';
import AdminDropDown from '../AdminDropDown/AdminDropDown';
import MarketingDropDown from '../MarketingDropDown/MarketingDropDown';
import SupportDropDown from '../SupportDropDown/SupportDropDown';
import { Eye, EyeOff } from 'lucide-react';
import Provider from '../Provider/Provider';
import { Link } from 'react-router-dom';
import Application from '../Application/Application';
import { toast } from 'react-toastify';
import { theme } from 'flowbite-react';
export default function Admin() {
  const [isAddEmployee, setIsAddEmployee] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [routeName, setRouteName] = useState('Admin');
  const [dropDownName, setDropDownName] = useState('Admin');
  const [isName, setIsName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('');
   const accessToken = localStorage.getItem('accessToken');
   function logOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken")
    window.location.reload()
  }
    useEffect(() => {
      if(accessToken != 'c3b0a9e1d5fa4c4f56e84d201d579e92'){
        alert('You dont have access to got here')
        logOut()
      }
     }, [])

   
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  function addEmployee() {
    setIsAddEmployee(true)
  }

  const handleSelect = (option) => {
    setRouteName(option);
    if (option != 'Provider' && option != 'Application') {
      setDropDownName(option)
    }
    setIsOpen(false);
    // setShowProvider(false);
  };

  

  ////////////////////////START ADD EMPLOYEES//////////////////////////////

  const addNewEmployees = async () => {

    console.log(isName);

    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/user/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name: isName, email, password, role })
      });

      const data = await response.json();

      if (response.ok) {
        // getProvider()
        toast.success(data.message, {
          theme: 'dark'
        })
        window.location.reload()
        setIsAddEmployee(false)
        clearInput()
      } else {
        switch (response.status) {
          case 500:
            toast.error(data.message, {
              theme: "dark"
            });
            break;
          default:
            toast('An error occurred. Please try again.', {
              theme: "dark"
            });
        }
      }

    } catch (err) {
      console.error("Error Saving Provider:", err);
    } finally {
      setIsLoading(false)
    }
  };

  function handleAdd(e) {
    e.preventDefault();
    if (role == 'Choose a Position') {
      toast("Please Choose the Employee Position" , {
        theme : 'dark'
      })
      return
    }

    if (isName == '' || email == '' || password == '' || confirmPassword == '' || role == '') {
      toast("All faildes is Rquired!" ,{
        theme : 'dark'
     } )
    } else {
      addNewEmployees()
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { theme: "dark" });
      return;
    }

  }

  function clearInput() {
    setIsName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('');

  }
  ////////////////////////END ADD EMPLOYEES//////////////////////////////

  return (
    <>
      <section className={`${styles.transaction_device_dashboard} pb-10 pl-20 px-9 mt-24`}>
        <div className={`${styles.dropdownMenu} relative flex justify-between items-center`}>
          <button
            id="dropdownDefaultButton"
            onClick={toggleDropdown}
            className={`${styles.dropdownDefaultButton} text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center`}
            type="button"
          >
            {dropDownName}
            <svg
              className="w-2.5 h-2.5 ml-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              id="dropdown"
              className={`${styles.dropdown} absolute mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}
            >
              <ul className={`${styles.dropDownSelected} py-2 text-sm text-gray-700 dark:text-gray-200`}>
                <li>
                  <a
                    href="#"
                    onClick={() => handleSelect("Admin")}
                    className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Admin
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => handleSelect("Marketing")}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Marketing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => handleSelect("Support")}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          )}
          <div>
            <button type="button"
              onClick={() => handleSelect("Application")}
              className="mx-3 text-white bg-black hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 
            dark:bg-gray-800 dark:hover:bg-gray-700
             dark:focus:ring-gray-700 dark:border-gray-700">Applications</button>
            <button type="button"
              onClick={() => handleSelect("Provider")}

              className="mx-3 text-white bg-black hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 
            dark:bg-gray-800 dark:hover:bg-gray-700
             dark:focus:ring-gray-700 dark:border-gray-700">Provider</button>
            {/* <Link to={'/layout/provider'} className="mx-3 text-white bg-black hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 
            dark:bg-gray-800 dark:hover:bg-gray-700
             dark:focus:ring-gray-700 dark:border-gray-700">Provider</Link> */}
            <button type="button"
              onClick={addEmployee}
              className="mx-3 text-black hover:text-white border
           border-black hover:bg-black focus:ring-4 focus:outline-none
            focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-black dark:text-black dark:hover:text-white
             dark:hover:bg-black">
              <i className="fa-solid fa-plus mr-4"></i>
              Add Employee</button>
          </div>

        </div>


        {(() => {
          switch (routeName) {
            case "Admin":
              return <AdminDropDown />;
            case "Marketing":
              return <MarketingDropDown />;
            case "Support":
              return <SupportDropDown />;
            case "Provider":
              return <Provider />;
            case "Application":
              return <Application />;
            default:
              return null;
          }
        })()}
        {/* {showProvider ? (
          <Provider />
        ) : (
          <>
            {routeName === "Admin" && <AdminDropDown />}
            {routeName === "Marketing" && <MarketingDropDown />}
            {routeName === "Support" && <SupportDropDown />}
          </>
        )} */}


        {isAddEmployee ?
          <form>
            <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      ADD Employee
                    </h3>
                    <button type="button" onClick={() => setIsAddEmployee(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <div className="px-4 md:p-5">
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label htmlFor="name" className="flex mb-2  font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" onChange={(e) => setIsName(e.target.value)} value={isName} name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Your Name" required="" />
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="email" className="flex mb-2  font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Your Email" required="" />
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="password"
                          className="flex mb-2  font-medium text-gray-900 dark:text-white">Password</label>
                        <div className="relative">
                          <input type={showPassword ? "text" : "password"}
                            onChange={(e) => setPassword(e.target.value)} value={password}
                            name="password"
                            id="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Enter Your Password" required="" />
                          <button
                            type="button"
                            className="absolute top-[12px] right-0 left-[347px] sm:left[290px] text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                          </button>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="confirmPassword" className="flex mb-2  font-medium text-gray-900 dark:text-white">Confirm Password</label>
                        <div className='relative'>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}
                          name="confirmPassword"
                          id="confirmPassword"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter Your Confirm Password" required="" />
                        <button
                          type="button"
                          className="absolute top-[12px] right-0 left-[347px] sm:left[290px] text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="countries" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Position</label>
                        <select onChange={(e) => setRole(e.target.value)} value={role} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <option selected>Choose a Position</option>
                          <option>Marketing</option>
                          <option>Support</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit"
                      onClick={handleAdd}
                      className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                      {isLoading ?
                        <i className='fas fa-spinner fa-spin text-2xl'></i>
                        : 'Add'}
                    </button>
                    <button type="submit" onClick={() => setIsAddEmployee(false)}
                      className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                      Cancel</button>

                  </div>
                </div>
              </div>
            </div>
          </form>
          : ''}

      </section>

    </>

  )
}



