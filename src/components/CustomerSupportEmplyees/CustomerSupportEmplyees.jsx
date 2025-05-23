import React, { useMemo, useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './CustomerSupportEmplyees.module.css';
import { Pagination } from 'flowbite-react';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';

export default function CustomerSupportEmplyees() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setAllPage] = useState(0);
  const [isAddCustomerSupport, setIsAddCustomerSupport] = useState(false);
  const [isName, setIsName] = useState('');
  const [email, setEmail] = useState('');
  const [isMacAddress, setIsMacAddress] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [isCountry, setIsCountry] = useState('');
  const [currency, setCurrency] = useState('$');
  const [app, setApp] = useState('');
  const [statue, setStatue] = useState('');
  const [provider, setProvider] = useState('');
  const [isAllProvider, setIsAllProvider] = useState([]);
  const [isAllApplications, setIsAllApplications] = useState([]);
  const [isAllCustomer, setIsAllCustomer] = useState([]);
  const [price, setPrice] = useState('');
  const [isAppFilter, setIsAppFilter] = useState('');
  const [isStatueFilter, setIsStatueFilter] = useState('');
  const [isProviderFilter, setIsProviderFilter] = useState('');
  const [isDateFilter, setIsDateFilter] = useState('');
  const [isEditeCustomer, setIsEditeCustomer] = useState(false);
  const [customerId, setCustomerId] = useState();
  const [searchCustomer, setSearchCustomer] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dates, setDates] = useState([null, null]);
  const [isNote, setIsNote] = useState('');
  const [isNotePopUp, setIsNotePopUp] = useState(false);
  const datePickerRef = useRef(null);
  const [boxes, setBoxes] = useState(0);
  const options = useMemo(() => countryList().getData(), []);
  const accessToken = localStorage.getItem('accessToken');
  function logOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken")
    window.location.reload()
  }
  useEffect(() => {
    if (accessToken != 'e4b0f2c5ab1d7ef293c2f5c8e9fdc510') {
      alert("Sorry You don't have access to got here :D")
      logOut()
    }
  }, [])

  function addCustomer() {
    setIsAddCustomerSupport(true)
  }

  function notePopUp(note) {
    setIsNotePopUp(true)
    setIsNote(note)
  }

  const changeHandler = value => {
    setIsCountry(value);
  };

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
      getCustomer(currentPage, isAppFilter, isProviderFilter, start, end, isStatueFilter)
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

  function editeCustomerPopUp(customers) {
    setIsEditeCustomer(true)
    setCustomerId(customers._id)
    setIsName(customers.name);
    setEmail(customers.email);
    setPrice(customers.price);
    setApp(customers.app);
    setProvider(customers.provider);
    setPhone(customers.phone);
    setStatue(customers.statue);
    setIsMacAddress(customers.mac_address);
    setCurrency(customers.currency);
    setIsCountry(customers.country);
    setBoxes(customers.boxes);

  }

  function handleFilterApp(value) {
    if (value == "App") {
      setIsAppFilter('')
      getCustomer(currentPage, '', isProviderFilter, from, to, isStatueFilter)
    } else {
      setIsAppFilter(value)
      getCustomer(currentPage, value, isProviderFilter, from, to, isStatueFilter)
    }

  }

  function handleFilterProvider(value) {
    if (value == "Provider") {
      setIsProviderFilter('')
      getCustomer(currentPage, isAppFilter, '', from, to, isStatueFilter)
    } else {
      setIsProviderFilter(value)
      getCustomer(currentPage, isAppFilter, value, from, to, isStatueFilter)
    }

  }

  function handleFilterStatus(value) {
    if (value == "Status") {
      setIsStatueFilter('')
      getCustomer(currentPage, isAppFilter, isProviderFilter, from, to, '')
    } else {
      setIsStatueFilter(value)
      getCustomer(currentPage, isAppFilter, isProviderFilter, from, to, value)
    }

  }



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

  /////////////////////// START GET APPLICATIONS FILTER FUNCTION////////////////
  const getCustomer = async (page, isAppFilter, isProviderFilter, from, to, isStatueFilter) => {

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/customer/get?page=${page}&app=${isAppFilter}&statue=${isStatueFilter}&provider=${isProviderFilter}&from=${from}&to=${to}&employee=Support`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();


      if (response.ok) {
        setIsAllCustomer(data.customers);
        setCurrentPage(data.page);
        setAllPage(data.totalPages)
        setIsNote(data.customers.note)
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
            setIsAllCustomer([])
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
    getCustomer(page, isAppFilter, isProviderFilter, from, to, isStatueFilter)
  };
  useEffect(() => {
    getCustomer(1, isAppFilter, isProviderFilter, from, to, isStatueFilter)
  }, [])
  /////////////////////// END GET APPLICATIONS FILTER FUNCTION////////////////



  ////////////////////////START ADD CUSTOMERS//////////////////////////////

  const addNewCustomer = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/customer/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name: isName, email, phone: '+' + phone, mac_address: isMacAddress, app, provider, price, currency, statue, country: isCountry.label, note: isNote, boxes })
      });

      const data = await response.json();

      if (response.ok) {
        getCustomer(currentPage, isAppFilter, isProviderFilter, from, to, isStatueFilter)
        toast.success(data.message, {
          theme: 'dark'
        })
        setIsAddCustomerSupport(false)
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
    if (app == 'Choose a App') {
      toast("Please Choose the Application", {
        theme: 'dark'
      })
      return
    } else if (provider == 'Choose a Provider') {
      toast("Please Choose the Provider", {
        theme: 'dark'
      })
      return
    } else if (statue == 'Choose a Status') {
      toast("Please Choose the Status", {
        theme: 'dark'
      })
      return
    }

    if (isName == '' || price == '' || statue == '' || isCountry == '') {
      toast("All faildes is Rquired!", {
        theme: 'dark'
      })
    } else {
      addNewCustomer()
    }



  }

  function clearInput() {
    setIsName('');
    setEmail('');
    setPrice('');
    setApp('');
    setProvider('');
    setPhone('');
    setStatue('');
    setIsMacAddress('');
    setCurrency('$');
    setIsCountry('');
    setIsNote('');
    setBoxes(0)
  }
  ////////////////////////END ADD CUSTOMERS//////////////////////////////

  //////////////////////START EDITE SUPPORT CUSTOMERS///////////////////////////////////
  const editeCustomers = async () => {

    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/customer/update/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name: isName, email, phone: '+' + phone, mac_address: isMacAddress, app, provider, price, currency, statue, country: isCountry, boxes })
      });

      const data = await response.json();

      if (response.ok) {
        getCustomer(currentPage, isAppFilter, isProviderFilter, from, to, isStatueFilter)
        toast.success(data.message, {
          theme: 'dark'
        })
        setIsEditeCustomer(false)
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
    if (phone == '' || price == '' || statue == '') {
      toast("All faildes is Rquired!", {
        theme: 'dark'
      })
    } else {
      editeCustomers()

    }

  }

  ////////////////////////////END EDITE SUPPORT CUSTOMERS/////////////////////////////////

  ///////////////////////////START SEARCH CUSTOMERS////////////////////////////////////
  const getSearchCustomer = async (macAddress) => {
    setSearchCustomer(macAddress);

    if (macAddress === '') {
      getCustomer(currentPage, isAppFilter, isProviderFilter, from, to, isStatueFilter); // Fetch all transactions if search is cleared
      return;
    }

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/customer/search?macAddress=${macAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsAllCustomer(data.customers);

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

  ///////////////////////////START RESELLER DETAILS//////////////////////////////////

  const handleDownload = async () => {
    try {
      const response = await fetch('https://masa-system.vercel.app/api/v1/customer/export', {
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
      link.setAttribute('download', 'SupportCustomers.xlsx');

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
      <section className='pr-10 pl-10 pb-10'>
        <div className={`${styles.customerSupport_table} `}>
          <div className='flex'>
            <div className={`${styles.searchInput} relative w-[50%] m-auto`}>
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>

              </div>
              <input onChange={(e) => getSearchCustomer(e.target.value)} type="search" id="default-search" className="block w-full h-11 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by Mac Address" required />
            </div>
            <button type="button"
              onClick={addCustomer}
              className="mx-3 text-black hover:text-white border
                   border-black hover:bg-black focus:ring-4 focus:outline-none
                    focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-black dark:text-black dark:hover:text-white
                     dark:hover:bg-black">
              <i className="fa-solid fa-plus mr-4"></i>
              Add Customer
            </button>
          </div>
          <table className='table-auto w-full mt-4'>
            <thead className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 '>
              <tr className={`${styles.customerSupport_header}`}>
                <th scope="col" className="py-3">Customer Info</th>
                <th scope="col" className="py-3">
                  <select
                    className="border bg-[#d1d1d1] border-gray-300 rounded  py-1 text-sm focus:outline-none"
                    onChange={(e) => handleFilterApp(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" >App</option>
                    {isAllApplications.map((applications) => (
                      <option value={applications.name}>{applications.name}</option>

                    ))}
                  </select>
                </th>
                <th scope="col" className="py-3">Mac address</th>
                <th scope="col" className="py-3">Country</th>
                <th scope="col" className="py-3">
                  <select
                    className="border bg-[#d1d1d1] border-gray-300 rounded  py-1 text-sm focus:outline-none"
                    onChange={(e) => handleFilterProvider(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" >Provider</option>
                    {isAllProvider.map((provider) => (
                      <option value={provider.name}>{provider.name}</option>

                    ))}
                  </select>
                </th>
                <th scope="col" className="py-3">Boxes</th>
                <th scope="col" className="py-3">Price</th>
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
                <th scope="col" className="py-3">
                  <select
                    className="border bg-[#d1d1d1] border-gray-300 rounded py-1 text-sm focus:outline-none"
                    onChange={(e) => handleFilterStatus(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" >Status</option>
                    <option value="Test">Test</option>
                    <option value="Sub">Sub</option>
                  </select>
                </th>
                <th scope="col" className="px-6 py-3">Note</th>
                <th scope="col" className="py-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {isAllCustomer.map((customers, index) => (
                <tr key={index}>
                  <td scope="col" className={`${styles.customerInfo} py-4 flex justify-between items-center relative`}>
                    <div className='text-center w-[90%]'>
                      {customers.name}
                    </div>
                    <i className="fa-solid fa-circle-info"></i>
                    <div className={`${styles.popUp} bg-black text-white p-4 rounded absolute top-0 left-[184px] hidden`}>
                      <p>{customers.email}</p>
                      <p>{customers.phone}</p>
                    </div>
                  </td>
                  <td scope="col" className="py-3">{customers.app ? customers.app : '-'}</td>
                  <td scope="col" className="py-3">{customers.mac_address ? customers.mac_address : '-'}</td>
                  <td scope="col" className="py-3">{customers.country}</td>
                  <td scope="col" className="py-3">{customers.provider ? customers.provider : '-'}</td>
                  <th scope="col" className="py-3">{customers.boxes}</th>
                  <td scope="col" className="py-3">{customers.price + '' + customers.currency}</td>
                  <td scope="col" className="py-3">{new Date(customers.createdAt).toISOString().split('T')[0]}</td>
                  <td scope="col" className="py-3">{customers.statue}</td>
                  <td scope="col" className="px-6 py-3 text-[#3E3D3D]">
                    <i className="fa-solid fa-circle-info cursor-pointer" onClick={() => notePopUp(customers.note)}></i>
                  </td>
                  <td scope="col" className="py-3">
                    <i onClick={() => editeCustomerPopUp(customers)} className={`${styles.icon_edite} fa-solid fa-pen mx-3 cursor-pointer`}></i>
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

            <div className={`${styles.export} text-[#7680DE] cursor-pointer mt-3`} onClick={handleDownload}>
              Export data...
            </div>

          </div>
        </div>



        {isAddCustomerSupport ?
          <form>
            <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-[500px]">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      ADD Customer
                    </h3>
                    <button type="button" onClick={() => setIsAddCustomerSupport(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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

                      <label htmlFor="phone" className="flex font-medium text-gray-900 dark:text-white">Phone</label>
                      <div className="bg-gray-100 rounded-xl p-2 w-full max-w-md col-span-2">
                        <PhoneInput
                          country={'eg'}
                          value={phone}
                          onChange={setPhone}
                          inputClass="!bg-gray-100 !w-full !border-none !rounded-xl !text-gray-800"
                          buttonClass="!bg-gray-100 !rounded-l-xl"
                          containerClass="!w-full"
                          inputStyle={{ height: '30px' }}
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="name" className="flex mb-2  font-medium text-gray-900 dark:text-white">Note</label>
                        <textarea type="text" onChange={(e) => setIsNote(e.target.value)} value={isNote} name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Your Note" required="" />
                      </div>


                      <div className='flex items-center justify-center col-span-2'>
                        <div className='w-1/2 mx-5'>
                          <label htmlFor="countries" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">App</label>
                          <select onChange={(e) => setApp(e.target.value)} value={app} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected>Choose a App</option>
                            {isAllApplications.map((applications) => (
                              <option value={applications.name}>{applications.name}</option>

                            ))}

                          </select>
                        </div>
                        <div className='w-1/2'>
                          <label htmlFor="macAddress" className="flex mb-2  font-medium text-gray-900 dark:text-white">Mac Address</label>
                          <input type="text" onChange={(e) => setIsMacAddress(e.target.value)} value={isMacAddress} name="macAddress" id="macAddress" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Your Mac address" required="" />
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
                        <div className='w-1/2 mr-[-17px]'>
                          <label htmlFor="macAddress" className="flex mb-2 font-medium text-gray-900 dark:text-white">Price</label>
                          <div className='flex'>
                            <input type="text" onChange={(e) => setPrice(e.target.value)} value={price} name="price" id="price"
                              className="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                            <select onChange={(e) => setCurrency(e.target.value)} value={currency} id="currency" className="mx-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              <option>$</option>
                              <option>Euro</option>
                              <option>DKK</option>
                              <option>SEK</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center justify-center col-span-2 mb-3'>
                      <div className='w-1/2 mx-5'>
                        <label htmlFor="boxes" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Boxes</label>
                        <input onChange={(e) => setBoxes(e.target.value)} value={boxes} id="boxes" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                      </div>
                      <div className='w-1/2 mx-5'>
                        <label htmlFor="countries" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Statue</label>
                        <select onChange={(e) => setStatue(e.target.value)} value={statue} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <option selected>Choose a Status</option>
                          <option>Test</option>
                          <option>Sub</option>
                        </select>
                      </div>

                    </div>

                    <div className='col-span-2 mb-3 pl-5'>
                      <label htmlFor="country" className="flex mb-2 font-medium text-gray-900 dark:text-white">Country</label>
                      <Select
                        options={options}
                        value={isCountry}
                        onChange={changeHandler}
                        className="text-black"
                        name="country"
                        inputId="country"
                      />
                    </div>

                    <button type="submit"
                      onClick={handleAdd}
                      className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                      {isLoading ?
                        <i className='fas fa-spinner fa-spin text-2xl'></i>
                        : 'Add'}
                    </button>
                    <button type="submit" onClick={() => setIsAddCustomerSupport(false)}
                      className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                      Cancel</button>

                  </div>
                </div>
              </div>
            </div>
          </form>
          : ''}

        {isEditeCustomer ?
          <form>
            <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-[500px]">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Edite Customer
                    </h3>
                    <button type="button" onClick={() => { setIsEditeCustomer(false); clearInput() }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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
                        <div
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          {isName}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="email" className="flex mb-2  font-medium text-gray-900 dark:text-white">Email</label>
                        <div
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          {email ? email : 'No Email'}
                        </div>
                      </div>

                      <label htmlFor="phone" className="flex font-medium text-gray-900 dark:text-white">Phone</label>
                      <div className="bg-gray-100 rounded-xl p-2 w-full max-w-md col-span-2">
                        <PhoneInput
                          country={'eg'}
                          value={phone}
                          onChange={setPhone}
                          inputClass="!bg-gray-100 !w-full !border-none !rounded-xl !text-gray-800"
                          buttonClass="!bg-gray-100 !rounded-l-xl"
                          containerClass="!w-full"
                          inputStyle={{ height: '30px' }}
                        />
                      </div>


                      <div className='flex items-center justify-center col-span-2'>
                        <div className='w-1/2 mx-5'>
                          <label htmlFor="app" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">App</label>
                          <div
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            {app ? app : 'No App'}
                          </div>
                        </div>
                        <div className='w-1/2'>
                          <label htmlFor="macAddress" className="flex mb-2  font-medium text-gray-900 dark:text-white">Mac Address</label>
                          <div
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            {isMacAddress ? isMacAddress : 'No Mac Address'}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center justify-center col-span-2'>
                        <div className='w-1/2 mx-5'>
                          <label htmlFor="provider" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Provider</label>
                          <div
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            {provider ? provider : 'No Provider'}
                          </div>
                        </div>
                        <div className='w-1/2 mr-[-17px]'>
                          <label htmlFor="macAddress" className="flex mb-2 font-medium text-gray-900 dark:text-white">Price</label>
                          <div className='flex'>
                            <input type="number" onChange={(e) => setPrice(e.target.value)} value={price} name="price" id="price"
                              className="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                            <div id="currency" className="mx-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              {currency}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center justify-center col-span-2 mb-3'>
                      <div className='w-1/2 mx-5'>
                        <label htmlFor="boxes" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Boxes</label>
                        <input type='number' onChange={(e) => setBoxes(e.target.value)} value={boxes} id="boxes" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                      </div>
                      <div className='w-1/2 mx-5'>
                        <label htmlFor="countries" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Statue</label>
                        <select onChange={(e) => setStatue(e.target.value)} value={statue} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <option selected>Choose a Status</option>
                          <option>Test</option>
                          <option>Sub</option>
                        </select>
                      </div>



                    </div>
                    <div className='col-span-2 mb-3 pl-5'>
                      <label htmlFor="country" className="flex mb-2  font-medium text-gray-900 dark:text-white">Country</label>
                      <div
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        {isCountry}
                      </div>
                    </div>


                    <button type="submit"
                      onClick={hundleUpdate}
                      className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                      {isLoading ?
                        <i className='fas fa-spinner fa-spin text-2xl'></i>
                        : 'Edite'}
                    </button>
                    <button type="submit" onClick={() => { setIsEditeCustomer(false); clearInput() }}
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
      </section>
    </>
  )
}
