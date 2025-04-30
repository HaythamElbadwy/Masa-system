import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './Reseller.module.css';
import { Pagination } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Reseller() {

  const [isAddReseller, setIsAddReseller] = useState(false);
  const [isName, setIsName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isAllReseller, setIsAllReseller] = useState([]);
  const [searchReseller, setSearchReseller] = useState('');

  function addReseller() {
    setIsAddReseller(true)
  }

  ////////////////////////START ADD RESELLER//////////////////////////////

  const addNewReseller = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name: isName })
      });

      const data = await response.json();

      if (response.ok) {
        getReseller()
        toast.success(data.message, {
          theme: 'dark'
        })
        setIsAddReseller(false)
        clearInput()
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
              theme: "dark"
            });
        }
      }

    } catch (err) {
      console.error("Error Saving Customer:", err);
    } finally {
      setIsLoading(false)
    }
  };

  function handleAdd(e) {
    e.preventDefault();
    if (isName == '') {
      toast("All faildes is Rquired!", {
        theme: 'dark'
      })
    } else {
      addNewReseller()
    }
  }

  function clearInput() {
    setIsName('');

  }
  ////////////////////////END ADD RESELLER//////////////////////////////

  /////////////////////// START GET RESELLER FUNCTION////////////////
  const getReseller = async () => {

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/get?employee=Admin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();


      if (response.ok) {
        setIsAllReseller(data.resellers);
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
            toast('An error occurred. Please try again.');
        }
      }

    } catch (err) {
      console.error("Error Saving Content:", err);
    } finally {
      setIsLoading(false)
    }


  };

  useEffect(() => {
    getReseller()
  }, [])
  //////////////////////////////END GET RESELLER FUNCTION///////////////////////////////

  ///////////////////////////START SEARCH CUSTOMERS////////////////////////////////////
  const getSearchReseller = async (name) => {
    setSearchReseller(name);

    if (name === '') {
      getReseller(); // Fetch all transactions if search is cleared
      return;
    }

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/search?name=${name}&employee=Admin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsAllReseller(data.resellers);
        console.log("ay7agaaa", data.resellers);

      } else {
        switch (response.status) {
          case 404:

            setIsAllCustomer([])
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

  ///////////////////////////END SEARCH CUSTOMERS/////////////////////////////////////

  return (
    <>
      <div className={`${styles.reseller_table} `}>
        <div className='flex'>
          <div className={`${styles.searchInput} relative w-[50%] m-auto`}>
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>

            </div>
            <input onChange={(e) => getSearchReseller(e.target.value)} type="search" id="default-search" className="block w-full h-11 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search By Name" required />
          </div>
          <button type="button"
            onClick={addReseller}
            className="mx-3 text-black hover:text-white border
           border-black hover:bg-black focus:ring-4 focus:outline-none
            focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-black dark:text-black dark:hover:text-white
             dark:hover:bg-black">
            <i className="fa-solid fa-plus mr-4"></i>
            Add Reseller</button>
        </div>
        <table className='table-auto w-full mt-4'>
          <thead className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 '>
            <tr className={`${styles.reseller_header}`}>
              <th scope="col" className="px-6 py-3">Reseller</th>
              <th scope="col" className="px-6 py-3">Account Num</th>
              <th scope="col" className="px-6 py-3">Device Num</th>
              <th scope="col" className="px-6 py-3">total debt</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {isAllReseller.map((reseller, index) => (
              <tr key={index}>
                <td scope="col" className="px-6 py-4 text-[#3E3D3D]">{reseller.name}</td>
                <td scope="col" className="px-6 py-3 text-[#3E3D3D]">
                  <span className='bg-black w-20 h-7 inline-block rounded-lg text-white'>{reseller.totalAccountNum}</span>
                </td>
                <td scope="col" className="px-6 py-3 text-[#3E3D3D]">
                  <span className='bg-black w-20 h-7 inline-block rounded-lg text-white'>{reseller.totalDeviceNum}</span>
                </td>
                <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{reseller.totalDebt}</td>
                <td scope="col" className="px-6 py-3 text-[#3E3D3D]">
                  <Link to={`resellerDetails/${reseller._id}`}><i className={`${styles.icon_eye} fa-solid fa-eye mx-3 cursor-pointer`}></i></Link>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>


      {isAddReseller ?
        <form>
          <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-[500px]">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    ADD Reseller
                  </h3>
                  <button type="button" onClick={() => setIsAddReseller(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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
                  </div>
                  <button type="submit"
                    onClick={handleAdd}
                    className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                    {isLoading ?
                      <i className='fas fa-spinner fa-spin text-2xl'></i>
                      : 'Add'}
                  </button>
                  <button type="submit" onClick={() => setIsAddReseller(false)}
                    className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                    Cancel</button>

                </div>
              </div>
            </div>
          </div>
        </form>
        : ''}
    </>
  )
}
