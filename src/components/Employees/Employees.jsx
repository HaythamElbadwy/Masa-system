import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './Employees.module.css';
import { Pagination, theme } from 'flowbite-react';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

export default function Employees() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setAllPage] = useState(0);
  const [position, setPosition] = useState('all');
  const [isAllEmployees, setIsAllEmployees] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isEditeEmployee, setIsEditeEmployee] = useState(false);
  const [isDeleteEmployee, setIsDeleteEmployee] = useState(false);
  const [isName, setIsName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('');
  const [employeesId, setEmployeesId] = useState();
  const [searchEmployees, setSearchEmployees] = useState('');

  function editeEmployeePopUp(employee) {
    setIsEditeEmployee(true)
    setEmployeesId(employee._id)
    setIsName(employee.name)
    setEmail(employee.email)
    setRole(employee.role)

  }
  function deleteEmployeePopUp(id) {
    setIsDeleteEmployee(true)
    setEmployeesId(id)
  }
  function handleFilterChange(value) {
    if (value == "Position") {
      setPosition('all')
      getEmployees(currentPage, 'all')
    } else {
      setPosition(value)
      getEmployees(currentPage, value)
    }

  }


  /////////////////////// START GET EMPLOYEE FUNCTION////////////////
  const getEmployees = async (page, position) => {

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/user/get?position=${position}&page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (isFirstLoad) {
          toast.success(data.message, { theme: "dark" });
          setIsFirstLoad(false);
        }
        setIsAllEmployees(data.users);
        setCurrentPage(data.page);
        setAllPage(data.totalPages)
      } else {
        switch (response.status) {
          case 500:
            toast.error(data.message, {
              theme: "dark"
            });
            break;
          case 404:
            toast.error(data.message, {
              theme: "dark"
            });
            break;
          default:
            toast('An error occurred. Please try again.', {
              theme: 'dark'
            });
        }
      }

    } catch (err) {
      console.error("Error Saving Content:", err);
    }
  };
  const onPageChange = (page) => {
    setCurrentPage(page)
    getEmployees(page, position)
  };

  useEffect(() => {
    getEmployees(1, position)
  }, [])
  /////////////////////// END GET EMPLOYEE FUNCTION/////////////////////////

  //////////////////////START EDITE EMPLOYEES///////////////////////////////////

  const editeEmployees = async () => {
    console.log(password);
    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/user/update/${employeesId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name: isName, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        getEmployees(currentPage, position)
        toast.success(data.message, {
          theme: 'dark'
        })
        setIsEditeEmployee(false)
        clearInput()
      } else {
        switch (response.status) {
          case 500:
            toast.error(data.message, {
              theme: "dark"
            });
            break;
          default:
            toast('An error occurred. Please try again.');
        }
      }

    } catch (err) {
      console.error("Error Saving Faqs:", err);
    } finally {
      setIsLoading(false)
    }
  };


  function hundleUpdate(e) {
    e.preventDefault();
    if (isName == '' || email == '') {

      toast("All faildes is Rquired!", { theme: "dark" })
    } else {
      editeEmployees(employeesId)

    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { theme: "dark" });
      return;
    }


  }

  ////////////////////END EDITE EMPLOYEES/////////////////////////////////

  /////////////////START DELETE EMPLOYEES////////////////////////////////

  const deleteEmployees = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/user/delete/${employeesId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, {
          theme: "dark"
        })
        setIsDeleteEmployee(false)
        getEmployees(currentPage, position);
      } else {
        switch (response.status) {
          case 500:
            toast.error(data.message, {
              theme: "dark"
            });
            break;
          default:
            toast('An error occurred. Please try again.', { theme: "dark" });
        }
      }

    } catch (err) {
      console.error("Error Saving Provider:", err);
    } finally {
      setIsLoading(false)
    }
  };
  function handleDelete() {
    deleteEmployees(employeesId)
  }
  //////////////////////END DELETE EMPLOYEES////////////////////////////////////////////

  ///////////////////////////START SEARCH EMPLOYEES////////////////////////////////////
  const getSearch = async (name) => {
    setSearchEmployees(name);

    if (name === '') {
      getEmployees(currentPage, position); // Fetch all transactions if search is cleared
      return;
    }

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/user/search?name=${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsAllEmployees(data.users);
        console.log("ay7agaaa", data.users);

      } else {
        switch (response.status) {
          case 404:

            setIsAllEmployees([])
            break;
          default:
            toast('An error occurred. Please try again.', { theme: "dark" });
        }
      }

    } catch (err) {
      console.error("Error fetching search results:", err);
    } finally {
      setIsLoading(false);
    }
  };

  ///////////////////////////END SEARCH EMPLOYEES/////////////////////////////////////

  return (
    <>
      <div className={`${styles.employees_table} `}>
        <div className={`${styles.searchInput} relative w-[50%] m-auto`}>
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>

          </div>
          <input onChange={(e) => getSearch(e.target.value)} type="search" id="default-search" className="block w-full h-11 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search By Name" required />
        </div>
        <table className='table-auto w-full mt-4'>
          <thead className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 '>
            <tr className={`${styles.employees_header}`}>
              <th scope="col" className="px-6 py-3">Employee</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">
                <select
                  className="border bg-[#d1d1d1] border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                  onChange={(e) => handleFilterChange(e.target.value)}
                  defaultValue=""
                >
                  <option value="Position">Position</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Support">Support</option>
                </select>
              </th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>

          </thead>
          <tbody>
            {isAllEmployees.map((employee, index) => (

              <tr key={index}>
                <td scope="col" className="py-4">{employee.name}</td>
                <td scope="col" className="py-3">{employee.email}</td>
                <td scope="col" className="py-3">{employee.role}</td>
                <td scope="col" className="py-3">
                  <i onClick={() => editeEmployeePopUp(employee)} className={`${styles.icon_edite} fa-solid fa-pen mx-3 cursor-pointer`}></i>
                  <i onClick={() => deleteEmployeePopUp(employee._id)} className={`${styles.icon_trash} fa-solid fa-trash mx-3 cursor-pointer`}></i>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

        <div className='flex items-center justify-between pl-4 pr-4'>
          <h3>Showing {currentPage} to {totalPages} of {totalPages}</h3>
          <div className="flex overflow-x-auto sm:justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          </div>
        </div>

      </div>



      {isEditeEmployee ?
        <form>
          <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Edite Employee
                  </h3>
                  <button type="button" onClick={() => setIsEditeEmployee(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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
                      <div id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {role}
                      </div>
                    </div>
                  </div>

                  <button type="submit"
                    onClick={hundleUpdate}
                    className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                    {isLoading ?
                      <i className='fas fa-spinner fa-spin text-2xl'></i>
                      : 'Edite'}
                  </button>
                  <button type="submit" onClick={() => setIsEditeEmployee(false)}
                    className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                    Cancel</button>

                </div>
              </div>
            </div>
          </div>
        </form>
        : ''}

      {isDeleteEmployee ?
        <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Provider
                </h3>
                <button type="button" onClick={() => setIsDeleteEmployee(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="px-4 md:p-5">
                <div className="grid gap-4 mb-4">
                  <h1 className='text-xl'>Do you want to Delete Employee?</h1>
                </div>

                <button type="submit"
                  onClick={handleDelete}
                  className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                  {isLoading ?
                    <i className='fas fa-spinner fa-spin text-2xl'></i>
                    : 'Yes'}
                </button>
                <button type="submit" onClick={() => setIsDeleteEmployee(false)}
                  className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                  No</button>

              </div>
            </div>
          </div>
        </div>
        : ''}

    </>
  )
}
