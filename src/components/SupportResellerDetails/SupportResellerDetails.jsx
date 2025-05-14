import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './SupportResellerDetails.module.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Pagination } from 'flowbite-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [isPayPopUp, setIsPayPopUp] = useState(false);
  const [isDebtPopUp, setIsDebtPopUp] = useState(false);
  const [pay, setPay] = useState(0);
  const [isPay, setIsPay] = useState(0);
  const [isAddDebt, setIsAddDebt] = useState(0);
  const [debt, setDebt] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [isDateFilter, setIsDateFilter] = useState('');
  const [isAllResellerCustomer, setIsAllResellerCustomer] = useState([]);
  const [resellerCustomerId, setResellerCustomerId] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [accountTotal, setAccountTotal] = useState(0);
  const [deviceTotal, setDeviceTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dates, setDates] = useState([null, null]);
  const [isResellerName, setIsResellerName] = useState("");
  const datePickerRef = useRef(null);
  const [isNote, setIsNote] = useState('');
  const [isNotePopUp, setIsNotePopUp] = useState(false);
  const { id } = useParams();
  const [isAllProvider, setIsAllProvider] = useState([]);
  const [isAllApplications, setIsAllApplications] = useState([]);
  const [provider, setProvider] = useState('');
  const [app, setApp] = useState('');


  /////////////////////// START GET PROVIDER FILTER FUNCTION///////////////////////
  const getProvider = async () => {

    try {
      const response = await fetch('https://masa-system.vercel.app/api/v1/provider/get?q=active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();
      if (response.ok) {
        setIsAllProvider(data.providers);
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
    getProvider()
  }, [])
  /////////////////////// END GET PROVIDER FILTER FUNCTION/////////////////////////

  /////////////////////// START GET APPLICATIONS FILTER FUNCTION////////////////
  const getApplications = async () => {

    try {
      const response = await fetch('https://masa-system.vercel.app/api/v1/application/get?q=active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();


      if (response.ok) {
        setIsAllApplications(data.applications);

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
    getApplications()
  }, [])
  /////////////////////// END GET APPLICATIONS FILTER FUNCTION////////////////

  const handleDateChange = (update) => {
    setDates(update);

    const [start, end] = update;
    if (start) console.log('Start Date:', start.toISOString().slice(0, 10));
    if (end) console.log('End Date:', end.toISOString().slice(0, 10));

    if (end) {
      setShowDatePicker(false);
      setFrom(start)
      setTo(end);
      setDates([null, null])
      getResellerCustomer(currentPage, start, end)
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  useEffect(() => {
    const accTotal = Number(accountNum) * Number(accountPrice);
    const devTotal = Number(deviceNum) * Number(devicePrice);
    setAccountTotal(accTotal);
    setDeviceTotal(devTotal);
    const fullTotal = accTotal + devTotal;
    setTotal(fullTotal);


    const paid = Number(pay);
    if (!isNaN(paid)) {
      setDebt(fullTotal - paid);
    }
  }, [accountNum, accountPrice, deviceNum, devicePrice, pay]);

  function payPopUp() {
    setIsPayPopUp(true)
  }

  function debtPopUp() {
    setIsDebtPopUp(true)
  }

  function notePopUp(note) {
    setIsNotePopUp(true)
    setIsNote(note)
  }

  function addNewSubscribePopUp() {
    setIsAddNewSubscribe(true)
  }

  // function editeSubscribePopUp(subscribes) {
  //   setIsEditeSubscribe(true)
  //   setResellerCustomerId(subscribes._id)
  //   setAccountNum(subscribes.accountNum)
  //   setDeviceNum(subscribes.deviceNum)
  //   setAccountPrice(subscribes.accountPrice)
  //   setDevicePrice(subscribes.devicePrice)
  //   setPay(subscribes.pay)
  //   setDebt(subscribes.debt)
  // }

  // function handleFilterDateReseller(value) {
  //   if (value == "Status") {
  //     setIsDateFilter('')
  //     getResellerCustomer(currentPage, '')
  //   } else {
  //     setIsDateFilter(value)
  //     getResellerCustomer(currentPage, value)
  //   }

  // }
  ////////////////////////START ADD RESELLER//////////////////////////////

  //////////////////////START EDITE RESELLER CUSTOMER/////////////////////////

  // const editeResellerDetails = async () => {

  //   setIsLoading(true)
  //   try {
  //     const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/update/${resellerCustomerId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'authorization': `sysOM0${localStorage.getItem('authToken')}`
  //       },
  //       body: JSON.stringify({ accountPrice, devicePrice, pay, debt })
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       getResellerCustomer(currentPage, isDateFilter)
  //       toast.success(data.message, {
  //         theme: 'dark'
  //       })
  //       setIsEditeSubscribe(false)
  //       clearInput()
  //     } else {
  //       switch (response.status) {
  //         case 500:
  //           toast.error(data.message, {
  //             theme: "dark"
  //           });
  //           break;
  //         default:
  //           toast('An error occurred. Please try again.');
  //       }
  //     }

  //   } catch (err) {
  //     console.error("Error Saving Faqs:", err);
  //   } finally {
  //     setIsLoading(false)
  //   }
  // };


  // function hundleUpdate(e) {
  //   e.preventDefault();
  //   if (accountPrice == '' || devicePrice == '' || debt == '' || pay == '') {
  //     toast("All faildes is Rquired!", {
  //       theme: 'dark'
  //     })
  //   } else {
  //     editeResellerDetails()

  //   }

  // }

  ////////////////////////////END EDITE RESELLER CUSTOMER/////////////////



  const addNewSubscribe = async () => {
    console.log(accountNum, deviceNum, accountPrice, devicePrice, pay, debt, currency);
    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/subscribe/${id}/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ accountNum, deviceNum, accountPrice, devicePrice, pay, debt, currency, note: isNote, provider, app })
      });

      const data = await response.json();

      if (response.ok) {
        getResellerCustomer(currentPage, from, to)


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
    if (debt == 0 || currency == '') {
      toast("All faildes is Rquired!", {
        theme: 'dark'
      })
    } else {
      addNewSubscribe()
    }
  }

  function clearInput() {
    setAccountNum(0);
    setDeviceNum(0);
    setAccountPrice(0);
    setDevicePrice(0);
    setPay(0);
    setDebt(0);
    setIsNote();
    setProvider();
    setApp();
  }
  ////////////////////////END ADD RESELLER//////////////////////////////

  /////////////////////// START GET RESELLER CUSTOMER FUNCTION////////////////
  const getResellerCustomer = async (page, from, to) => {

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/getSubscribes?page=${page}&resellerId=${id}&from=${from}&to=${to}`, {
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
        setAllPage(data.totalPages);
        setTotalDebt(data.totalDebt)
        setIsResellerName(data.reseller_name)
        setIsNote(data.subscribes.note)

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
    getResellerCustomer(page, from, to)
  };

  useEffect(() => {
    getResellerCustomer(1, from, to)
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

  ////////////////////////////START DEBT FUNCTION/////////////////

  const addDebt = async () => {

    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/subscribe/${id}/debt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          accountNum: 0, deviceNum: 0, accountPrice: 0
          , devicePrice: 0, pay: 0, debt: isAddDebt
        })
      });

      const data = await response.json();

      if (response.ok) {
        getResellerCustomer(currentPage, from, to)
        toast.success(data.message, {
          theme: 'dark'
        })
        setIsDebtPopUp(false)
        clearInputDebt()
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

  function handleAddDebt(e) {
    e.preventDefault();
    if (isAddDebt == 0) {
      toast("All faildes is Rquired!", {
        theme: 'dark'
      })
    } else {
      addDebt()
    }
  }

  function clearInputDebt() {
    setIsAddDebt(0)
  }
  ////////////////////////END DEBT FUNCTION//////////////////////////////

  ////////////////////////////START PAY FUNCTION/////////////////

  const addPay = async () => {

    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/subscribe/${id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          accountNum: 0, deviceNum: 0, accountPrice: 0
          , devicePrice: 0, pay: isPay, debt: 0
        })
      });

      const data = await response.json();

      if (response.ok) {
        getResellerCustomer(currentPage, from, to)
        toast.success(data.message, {
          theme: 'dark'
        })
        setIsPayPopUp(false)
        clearInputPay()
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

  function handleAddPay(e) {
    e.preventDefault();
    if (isPay == 0) {
      toast("All faildes is Rquired!", {
        theme: 'dark'
      })
    } else {
      addPay()
    }
  }

  function clearInputPay() {
    setIsPay(0)
  }
  ////////////////////////END PAY FUNCTION//////////////////////////////


  return (
    <>
      <section className='mt-24 pl-10 pr-10 mb-20'>
        <div className='flex ml-5 mt-10 text-[#3E3D3D] font-bold text-2xl'>
          <h1>{isResellerName}</h1>
        </div>
        <div className={`${styles.resellerDetails_table} `}>
          <div className='flex items-center justify-between'>

            <button type="button"
              onClick={addNewSubscribePopUp}
              className="mx-3 text-black hover:text-white border
                          border-black hover:bg-black focus:ring-4 focus:outline-none
                           focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-black dark:text-black dark:hover:text-white
                            dark:hover:bg-black">
              <i className="fa-solid fa-plus mr-4"></i>
              Add New Subscribe</button>

            <div>
              <button type="button"
                onClick={debtPopUp}
                className="mx-3 text-black hover:text-white border
              border-black hover:bg-black focus:ring-4 focus:outline-none
               focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-black dark:text-black dark:hover:text-white
                dark:hover:bg-black">
                <i className="fa-solid fa-plus mr-4"></i>
                Debt</button>

              <button type="button"
                onClick={payPopUp}
                className="mx-3 text-black hover:text-white border
                          border-black hover:bg-black focus:ring-4 focus:outline-none
                           focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-black dark:text-black dark:hover:text-white
                            dark:hover:bg-black">
                <i className="fa-solid fa-plus mr-4"></i>
                PAY</button>
            </div>
          </div>
          <table className='table-auto w-full mt-4'>
            <thead className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 '>
              <tr className={`${styles.reseller_header}`}>
                <th scope="col" className="py-3">
                  <div className="relative" ref={datePickerRef}>
                    <span
                      className=" cursor-pointer"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      Select Date Range
                    </span>
                    {showDatePicker && (
                      <div className="absolute z-10">
                        <DatePicker
                          selected={dates[0]}
                          onChange={handleDateChange}
                          startDate={dates[0]}
                          endDate={dates[1]}
                          selectsRange
                          inline
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select date range"
                        />
                      </div>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">Playlists</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Boxes</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Pay</th>
                <th scope="col" className="px-6 py-3">Debt</th>
                <th scope="col" className="px-6 py-3">Provider</th>
                <th scope="col" className="px-6 py-3">App</th>
                <th scope="col" className="px-6 py-3">Note</th>
                {/* <th scope="col" className="px-6 py-3">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {isAllResellerCustomer.map((subscribes, index) => (
                <tr key={index}>
                  <td scope="col" className="px-6 py-4 text-[#3E3D3D]">{new Date(subscribes.createdAt).toISOString().split('T')[0]}</td>
                  <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.accountNum}</td>
                  <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.accountPrice}{subscribes.currency ? subscribes.currency : ''}</td>
                  <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.deviceNum}</td>
                  <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.devicePrice}{subscribes.currency ? subscribes.currency : ''}</td>
                  <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.pay}</td>
                  <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.debt}</td>
                  <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.provider ? subscribes.provider : '-'}</td>
                  <td scope="col" className="px-6 py-3 text-[#3E3D3D]">{subscribes.app ? subscribes.app : '-'}</td>
                  <td scope="col" className="px-6 py-3 text-[#3E3D3D]">
                    <i className="fa-solid fa-circle-info cursor-pointer" onClick={() => notePopUp(subscribes.note)}></i>
                  </td>
                  {/* <td scope="col" className="px-6 py-3 text-[#3E3D3D]">
                    <i onClick={() => editeSubscribePopUp(subscribes)} className={`${styles.icon_edite} fa-solid fa-pen mx-3 cursor-pointer`}></i>
                  </td> */}
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
            <div>
              <h2 className='flex items-center'>Total Debt:  <p scope="col" className="py-3 text-[#3E3D3D]">
                <span className='bg-black w-20 h-7 inline-block rounded-lg ml-2 text-white'>{totalDebt}</span>
              </p></h2>
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
                  <button type="button" onClick={() => { setIsAddNewSubscribe(false); clearInput() }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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
                        <label htmlFor="applicationNum" className="flex mb-2  font-medium text-gray-900 dark:text-white">Playlists</label>
                        <input onChange={(e) => setAccountNum(e.target.value)} value={accountNum} type="number" name="applicationNum" id="applicationNum" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                      </div>
                      <div className='w-1/2 mr-[-17px]'>
                        <label htmlFor="price" className="flex mb-2 font-medium text-gray-900 dark:text-white">Price/Piece</label>
                        <div className='flex'>
                          <input onChange={(e) => setAccountPrice(e.target.value)} value={accountPrice} type="number" name="price" id="price"
                            className="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                          <select onChange={(e) => setCurrency(e.target.value)} value={currency} id="countries" className="mx-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option>$</option>
                            <option>Euro</option>
                            <option>DKK</option>
                            <option>SEK</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center justify-center col-span-2'>
                      <div className='w-1/2 mx-5'>
                        <label htmlFor="deviceNum" className="flex mb-2  font-medium text-gray-900 dark:text-white">Boxes</label>
                        <input onChange={(e) => setDeviceNum(e.target.value)} value={deviceNum} type="number" name="deviceNum" id="deviceNum" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                      </div>
                      <div className='w-1/2 mr-[-17px]'>
                        <label htmlFor="priceDevice" className="flex mb-2 font-medium text-gray-900 dark:text-white">Price/Piece</label>
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
                        <input value={debt} type="number" name="debt" id="debt" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                      </div>
                    </div>
                    <div className='flex items-center justify-center col-span-2'>
                      <div className='w-1/2 mx-5'>
                        <label htmlFor="provider" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Provider</label>
                        <select onChange={(e) => setProvider(e.target.value)} value={provider} id="provider" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <option selected>Choose a Provider</option>
                          {isAllProvider.map((provider) => (
                            <option value={provider.name}>{provider.name}</option>

                          ))}
                        </select>
                      </div>
                      <div className='w-1/2 mx-5'>
                        <label htmlFor="countries" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">App</label>
                        <select onChange={(e) => setApp(e.target.value)} value={app} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <option selected>Choose a App</option>
                          {isAllApplications.map((applications) => (
                            <option value={applications.name}>{applications.name}</option>

                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2 pl-5">
                      <label htmlFor="name" className="flex mb-2  font-medium text-gray-900 dark:text-white">Note</label>
                      <textarea type="text" onChange={(e) => setIsNote(e.target.value)} value={isNote} name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Your Note" required="" />
                    </div>
                  </div>


                  <button type="submit"
                    onClick={handleAdd}
                    className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                    {isLoading ?
                      <i className='fas fa-spinner fa-spin text-2xl'></i>
                      : 'Add'}
                  </button>
                  <button type="submit" onClick={() => { setIsAddNewSubscribe(false); clearInput() }}
                    className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                    Cancel</button>

                </div>
              </div>
            </div>
          </div>
        </form>
        : ''}

      {isPayPopUp ?
        <form>
          <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-[500px]">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pay
                  </h3>
                  <button type="button" onClick={() => { setIsPayPopUp(false); clearInput() }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="px-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className='col-span-2 mx-5'>
                      <label htmlFor="pay" className="flex mb-2  font-medium text-gray-900 dark:text-white">Pay</label>
                      <input onChange={(e) => setIsPay(e.target.value)} value={isPay} type="number" name="pay" id="pay" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                    </div>
                  </div>

                  <button type="submit"
                    onClick={handleAddPay}
                    className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                    {isLoading ?
                      <i className='fas fa-spinner fa-spin text-2xl'></i>
                      : 'Add'}
                  </button>
                  <button type="submit" onClick={() => { setIsPayPopUp(false); clearInput() }}
                    className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                    Cancel</button>

                </div>
              </div>
            </div>
          </div>
        </form>
        : ''}

      {isDebtPopUp ?
        <form>
          <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-[500px]">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Debt
                  </h3>
                  <button type="button" onClick={() => { setIsDebtPopUp(false); clearInput() }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="px-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className='col-span-2 mx-5'>
                      <label htmlFor="pay" className="flex mb-2  font-medium text-gray-900 dark:text-white">Debt</label>
                      <input onChange={(e) => setIsAddDebt(e.target.value)} value={isAddDebt} type="number" name="pay" id="pay" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                    </div>
                  </div>

                  <button type="submit"
                    onClick={handleAddDebt}
                    className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                    {isLoading ?
                      <i className='fas fa-spinner fa-spin text-2xl'></i>
                      : 'Add'}
                  </button>
                  <button type="submit" onClick={() => { setIsDebtPopUp(false); clearInput() }}
                    className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                    Cancel</button>

                </div>
              </div>
            </div>
          </div>
        </form>
        : ''}

      {isNotePopUp ?
        <form>
          <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-[500px]">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Note
                  </h3>
                  <button type="button" onClick={() => { setIsNotePopUp(false); clearInput() }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="px-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className='col-span-2 mx-5'>
                      <label htmlFor="note" className="flex mb-2  font-medium text-gray-900 dark:text-white">Note</label>
                      <textarea readOnly value={isNote} type="text" name="note" id="note" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        : ''}

      {/* {isEditeSubscribe ?
        <form>
          <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-[500px]">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Edite New Subscribe
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
        : ''} */}


    </>
  )
}
