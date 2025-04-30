import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './SupportResellerDetails.module.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Pagination } from 'flowbite-react';

export default function SupportResellerDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setAllPage] = useState(0);
  const [isAddNewSubscribe, setIsAddNewSubscribe] = useState(false);
  const [isEditeSubscribe, setIsEditeSubscribe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountNum, setAccountNum] = useState(0);
  const [deviceNum, setDeviceNum] = useState(0);
  const [accountPrice, setAccountPrice] = useState(0);
  const [devicePrice, setDevicePrice] = useState(0);
  const [currency, setCurrency] = useState('$');
  const [pay, setPay] = useState(0);
  const [debt, setDebt] = useState(0);
  const [isDateFilter, setIsDateFilter] = useState('');
  const [isAllResellerCustomer, setIsAllResellerCustomer] = useState([]);
  const [resellerCustomerId, setResellerCustomerId] = useState();
  const { id } = useParams()
  console.log(id);


  function addNewSubscribePopUp() {
    setIsAddNewSubscribe(true)
  }

  function editeSubscribePopUp(subscribes) {
    setIsEditeSubscribe(true)
    setResellerCustomerId(subscribes._id)
    setAccountNum(subscribes.accountNum)
    setDeviceNum(subscribes.deviceNum)
    setAccountPrice(subscribes.accountPrice)
    setDevicePrice(subscribes.devicePrice)
    setPay(subscribes.pay)
    setDebt(subscribes.debt)
  }

  function handleFilterDateReseller(value) {
    if (value == "Status") {
      setIsDateFilter('')
      getResellerCustomer(currentPage, '')
    } else {
      setIsDateFilter(value)
      getResellerCustomer(currentPage, value)
    }

  }
  ////////////////////////START ADD RESELLER//////////////////////////////

  //////////////////////START EDITE RESELLER CUSTOMER/////////////////////////

  const editeResellerDetails = async () => {

    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/update/${resellerCustomerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ accountPrice, devicePrice, pay, debt })
      });

      const data = await response.json();

      if (response.ok) {
        getResellerCustomer(currentPage, isDateFilter)
        toast.success(data.message, {
          theme: 'dark'
        })
        setIsEditeSubscribe(false)
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
    if (accountPrice == '' || devicePrice == '' || debt == '' || pay == '') {
      toast("All faildes is Rquired!", {
        theme: 'dark'
      })
    } else {
      editeResellerDetails()

    }

  }

  ////////////////////////////END EDITE RESELLER CUSTOMER//////////////////////////////

  const addNewSubscribe = async () => {

    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/subscribe/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ accountNum, deviceNum, accountPrice, devicePrice, pay, debt, currency })
      });

      const data = await response.json();

      if (response.ok) {
        getResellerCustomer(currentPage, isDateFilter)
        toast.success(data.message, {
          theme: 'dark'
        })
        setIsAddNewSubscribe(false)
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
    if (accountNum == 0 || deviceNum == 0 || accountPrice == 0 || devicePrice == 0 || pay == 0
      || debt == 0 || currency == '') {
      toast("All faildes is Rquired!", {
        theme: 'dark'
      })
    } else {
      addNewSubscribe()
    }
  }

  function clearInput() {
    setAccountNum(0)
    setDeviceNum(0)
    setAccountPrice(0)
    setDevicePrice(0)
    setPay(0)
    setDebt(0)

  }
  ////////////////////////END ADD RESELLER//////////////////////////////

  /////////////////////// START GET RESELLER CUSTOMER FUNCTION////////////////
  const getResellerCustomer = async (page, isDateFilter) => {

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/getSubscribes?page=${page}&resellerId=${id}&date=${isDateFilter}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();


      if (response.ok) {
        setIsAllResellerCustomer(data.subscribes);
        setCurrentPage(data.page);
        setAllPage(data.totalPages)
        console.log(data);

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
            setIsAllResellerCustomer([])
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

  const onPageChange = (page) => {
    setCurrentPage(page)
    getResellerCustomer(page, isDateFilter)
  };

  useEffect(() => {
    getResellerCustomer(1, isDateFilter)
  }, [])
  //////////////////////////////END GET RESELLER CUSTOMER FUNCTION////////////////////


  ///////////////////////////START RESELLER DETAILS//////////////////////////////////

  const handleDownloadReseller = async () => {
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/export/${id}`, {
        method: 'GET',
        headers: {
          'authorization': `sysOM0${localStorage.getItem('authToken')}`, // If applicable, replace YOUR_TOKEN with your actual token
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Create a Blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resellers.xlsx');

      // Append to the body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  ///////////////////////////END RESELLER DETAILS//////////////////////////////////

    
  return (
    <>
          <section className='mt-24 pl-10 pr-10'>
            <div className='flex ml-5 mt-10 text-[#3E3D3D] font-bold text-2xl'>
              <h1>Reseller Name</h1>
            </div>
            <div className={`${styles.resellerDetails_table} `}>
              <div className='flex'>
    
                <button type="button"
                  onClick={addNewSubscribePopUp}
                  className="mx-3 text-black hover:text-white border
                          border-black hover:bg-black focus:ring-4 focus:outline-none
                           focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-black dark:text-black dark:hover:text-white
                            dark:hover:bg-black">
                  <i className="fa-solid fa-plus mr-4"></i>
                  Add New Subscribe</button>
              </div>
              <table className='table-auto w-full mt-4'>
                <thead className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 '>
                  <tr className={`${styles.reseller_header}`}>
                    <th scope="col" className="px-6 py-3"><input
                      type="date"
                      className="border bg-[#d1d1d1] border-gray-300 rounded py-1 text-sm focus:outline-none"
                      onChange={(e) => handleFilterDateReseller(e.target.value)} /></th>
                    <th scope="col" className="px-6 py-3">Account Num</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Device Num</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Pay</th>
                    <th scope="col" className="px-6 py-3">Debt</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isAllResellerCustomer.map((subscribes, index) => (
                    <tr key={index}>
                      <td scope="col" className="px-6 py-4 text-[#3E3D3D]">{subscribes.createdAt}</td>
                      <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.accountNum}</td>
                      <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.accountPrice + '' + subscribes.currency}</td>
                      <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.deviceNum}</td>
                      <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.devicePrice + '' + subscribes.currency}</td>
                      <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.pay}</td>
                      <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.debt}</td>
                      <td scope="col" className="px-6 py-3 text-[#3E3D3D]">
                        <i onClick={() => editeSubscribePopUp(subscribes)} className={`${styles.icon_edite} fa-solid fa-pen mx-3 cursor-pointer`}></i>
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
                <div className={`${styles.export} text-[#7680DE] cursor-pointer mt-3`} onClick={handleDownloadReseller}>
                  Export data....
                </div>
              </div>
            </div>
    
    
          </section>
    
    
    
          {isAddNewSubscribe ?
            <form>
              <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
                <div className="relative p-4 w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-[500px]">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        ADD New Subscribe
                      </h3>
                      <button type="button" onClick={() => setIsAddNewSubscribe(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    <div className="px-4 md:p-5">
                      <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className='flex items-center justify-center col-span-2'>
                          <div className='w-1/2 mx-5'>
                            <label htmlFor="applicationNum" className="flex mb-2  font-medium text-gray-900 dark:text-white">Applications Num</label>
                            <input onChange={(e) => setAccountNum(e.target.value)} value={accountNum} type="number" name="applicationNum" id="applicationNum" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                          </div>
                          <div className='w-1/2 mr-[-17px]'>
                            <label htmlFor="price" className="flex mb-2 font-medium text-gray-900 dark:text-white">Price</label>
                            <div className='flex'>
                              <input onChange={(e) => setAccountPrice(e.target.value)} value={accountPrice} type="number" name="price" id="price"
                                className="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                              <select onChange={(e) => setCurrency(e.target.value)} value={currency} id="countries" className="mx-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option>$</option>
                                <option>Euro</option>
                                <option>Corona</option>
                              </select>
                            </div>
                          </div>
                        </div>
    
                        <div className='flex items-center justify-center col-span-2'>
                          <div className='w-1/2 mx-5'>
                            <label htmlFor="deviceNum" className="flex mb-2  font-medium text-gray-900 dark:text-white">Device Num</label>
                            <input onChange={(e) => setDeviceNum(e.target.value)} value={deviceNum} type="number" name="deviceNum" id="deviceNum" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                          </div>
                          <div className='w-1/2 mr-[-17px]'>
                            <label htmlFor="priceDevice" className="flex mb-2 font-medium text-gray-900 dark:text-white">Price</label>
                            <div className='flex'>
                              <input onChange={(e) => setDevicePrice(e.target.value)} value={devicePrice} type="number" name="price" id="priceDevice"
                                className="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
    
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-center col-span-2'>
                          <div className='w-1/2 mx-5'>
                            <label htmlFor="pay" className="flex mb-2  font-medium text-gray-900 dark:text-white">Pay</label>
                            <input onChange={(e) => setPay(e.target.value)} value={pay} type="number" name="pay" id="pay" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                          </div>
                          <div className='w-1/2 mx-5'>
                            <label htmlFor="debt" className="flex mb-2  font-medium text-gray-900 dark:text-white">Debt</label>
                            <input onChange={(e) => setDebt(e.target.value)} value={debt} type="number" name="debt" id="debt" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                          </div>
                        </div>
                      </div>
    
    
                      <button type="submit"
                        onClick={handleAdd}
                        className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                        {isLoading ?
                          <i className='fas fa-spinner fa-spin text-2xl'></i>
                          : 'Add'}
                      </button>
                      <button type="submit" onClick={() => setIsAddNewSubscribe(false)}
                        className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                        Cancel</button>
    
                    </div>
                  </div>
                </div>
              </div>
            </form>
            : ''}
    
          {isEditeSubscribe ?
            <form>
              <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
                <div className="relative p-4 w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-[500px]">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        ADD New Subscribe
                      </h3>
                      <button type="button" onClick={() => { setIsEditeSubscribe(false); clearInput() }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    <div className="px-4 md:p-5">
                      <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className='flex items-center justify-center col-span-2'>
                          <div className='w-1/2 mx-5'>
                            <label htmlFor="applicationNum" className="flex mb-2  font-medium text-gray-900 dark:text-white">Applications Num</label>
                            <div type="number" name="applicationNum" id="applicationNum"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 
                            flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="">
                              {accountNum}
                            </div>
                          </div>
                          <div className='w-1/2 mr-[-17px]'>
                            <label htmlFor="price" className="flex mb-2 font-medium text-gray-900 dark:text-white">Price</label>
                            <div className='flex'>
                              <input onChange={(e) => setAccountPrice(e.target.value)} value={accountPrice} type="number" name="price" id="price"
                                className="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                              <div id="countries" className="mx-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {currency}
                              </div>
                            </div>
                          </div>
                        </div>
    
                        <div className='flex items-center justify-center col-span-2'>
                          <div className='w-1/2 mx-5'>
                            <label htmlFor="deviceNum" className="flex mb-2  font-medium text-gray-900 dark:text-white">Device Num</label>
                            <div type="number" name="deviceNum" id="deviceNum"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 
                            flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="">
                              {deviceNum}
                            </div>
                          </div>
                          <div className='w-1/2 mr-[-17px]'>
                            <label htmlFor="priceDevice" className="flex mb-2 font-medium text-gray-900 dark:text-white">Price</label>
                            <div className='flex'>
                              <input onChange={(e) => setDevicePrice(e.target.value)} value={devicePrice} type="number" name="price" id="priceDevice"
                                className="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
    
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-center col-span-2'>
                          <div className='w-1/2 mx-5'>
                            <label htmlFor="pay" className="flex mb-2  font-medium text-gray-900 dark:text-white">Pay</label>
                            <input onChange={(e) => setPay(e.target.value)} value={pay} type="number" name="pay" id="pay" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                          </div>
                          <div className='w-1/2 mx-5'>
                            <label htmlFor="debt" className="flex mb-2  font-medium text-gray-900 dark:text-white">Debt</label>
                            <input onChange={(e) => setDebt(e.target.value)} value={debt} type="number" name="debt" id="debt" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
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
                      <button type="submit" onClick={() => { setIsEditeSubscribe(false); clearInput() }}
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
