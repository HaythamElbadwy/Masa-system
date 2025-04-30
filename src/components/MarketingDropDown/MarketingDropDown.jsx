import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './MarketingDropDown.module.css';
import { Pagination } from 'flowbite-react';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';

export default function MarketingDropDown() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setAllPage] = useState(0);
  const [isAddCustomer, setIsAddCustomer] = useState(false);
  const [isEditeCustomer, setIsEditeCustomer] = useState(false);
  const [isName, setIsName] = useState();
  const [email, setEmail] = useState();
  const [isMacAddress, setIsMacAddress] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [isCountry, setIsCountry] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('$');
  const [provider, setProvider] = useState('');
  const [app, setApp] = useState('');
  const [statue, setStatue] = useState('');
  const [isAppFilter, setIsAppFilter] = useState('');
  const [isStatueFilter, setIsStatueFilter] = useState('');
  const [isProviderFilter, setIsProviderFilter] = useState('');
  const [isDateFilter, setIsDateFilter] = useState('');
  const [customerId, setCustomerId] = useState();
  const [employeeId, setEmployeeId] = useState('');
  const [isAllProvider, setIsAllProvider] = useState([]);
  const [isAllApplications, setIsAllApplications] = useState([]);
  const [isAllCustomer, setIsAllCustomer] = useState([]);
  const [position, setPosition] = useState('Marketing');
  const [isAllEmployees, setIsAllEmployees] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState('');
  function addCustomerPopUp() {
    setIsAddCustomer(true)
  }

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

  }


  function handleFilterApp(value) {
    if (value == "App") {
      setIsAppFilter('')
      getCustomer(currentPage, employeeId, '', isProviderFilter, isDateFilter, isStatueFilter)
    } else {
      setIsAppFilter(value)
      getCustomer(currentPage, employeeId, value, isProviderFilter, isDateFilter, isStatueFilter)
    }

  }

  function handleFilterProvider(value) {
    if (value == "Provider") {
      setIsProviderFilter('')
      getCustomer(currentPage, employeeId, isAppFilter, '', isDateFilter, isStatueFilter)
    } else {
      setIsProviderFilter(value)
      getCustomer(currentPage, employeeId, isAppFilter, value, isDateFilter, isStatueFilter)
    }

  }

  function handleFilterStatus(value) {
    if (value == "Status") {
      setIsStatueFilter('')
      getCustomer(currentPage, employeeId, isAppFilter, isProviderFilter, isDateFilter, '')
    } else {
      setIsStatueFilter(value)
      getCustomer(currentPage, employeeId, isAppFilter, isProviderFilter, isDateFilter, value)
    }

  }

  function handleFilterDate(value) {
    if (value == "s") {
      setIsDateFilter('')
      getCustomer(currentPage, employeeId, isAppFilter, isProviderFilter, '', isStatueFilter)
    } else {
      setIsDateFilter(value)
      getCustomer(currentPage, employeeId, isAppFilter, isProviderFilter, value, isStatueFilter)
    }

  }

  function handleFilterEmployee(value) {
    console.log(value);

    if (value == "Employees") {
      setEmployeeId('')
      getCustomer(currentPage, '', isAppFilter, isProviderFilter, isDateFilter, isStatueFilter)
    } else {
      const id = isAllEmployees.filter(e => e.name == value)[0]._id
      setEmployeeId(id)

      getCustomer(currentPage, id, isAppFilter, isProviderFilter, isDateFilter, isStatueFilter)
    }

  }

  /////////////////////// START GET EMPLOYEE FUNCTION////////////////
  const getEmployees = async (position) => {

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/user/get?position=${position}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();

      if (response.ok) {

        setIsAllEmployees(data.users);
        console.log(data.users);


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


  useEffect(() => {
    getEmployees(position)
  }, [])
  /////////////////////// END GET EMPLOYEE FUNCTION/////////////////////////

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
        body: JSON.stringify({ name: isName, email, phone: '+' + phone, mac_address: isMacAddress, app, provider, price, currency, statue, country: isCountry })
      });

      const data = await response.json();

      if (response.ok) {
        getCustomer(currentPage, employeeId, isAppFilter, isProviderFilter, isStatueFilter, isDateFilter)
        toast.success(data.message, {
          theme: 'dark'
        })
        setIsAddCustomer(false)
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

    if (isName == '' || email == '' || phone == '' || isMacAddress == '' || app == ''
      || provider == '' || price == '' || statue == '') {
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
  }
  ////////////////////////END ADD CUSTOMERS//////////////////////////////

  /////////////////////// START GET APPLICATIONS FILTER FUNCTION////////////////
  const getCustomer = async (page, employeeId, isAppFilter, isProviderFilter, isDateFilter, isStatueFilter) => {

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/customer/get?page=${page}&app=${isAppFilter}&statue=${isStatueFilter}&provider=${isProviderFilter}&date=${isDateFilter}&employee=Marketing&employeeId=${employeeId}`, {
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
    getCustomer(page, employeeId, isAppFilter, isProviderFilter, isStatueFilter, isDateFilter)
  };
  useEffect(() => {
    getCustomer(1, employeeId, isAppFilter, isProviderFilter, isStatueFilter, isDateFilter)
  }, [])
  /////////////////////// END GET APPLICATIONS FILTER FUNCTION////////////////

  //////////////////////START EDITE CUSTOMERS///////////////////////////////////

  const editeCustomers = async () => {

    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/customer/update/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name: isName, email, phone: '+' + phone, mac_address: isMacAddress, app, provider, price, currency, statue, country: isCountry })
      });

      const data = await response.json();

      if (response.ok) {
        getCustomer(currentPage, employeeId, isAppFilter, isProviderFilter, isStatueFilter, isDateFilter)
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

  ////////////////////////////END EDITE CUSTOMERS/////////////////////////////////

  ///////////////////////////START SEARCH CUSTOMERS////////////////////////////////////
  const getSearchCustomer = async (macAddress) => {
    setSearchCustomer(macAddress);

    if (macAddress === '') {
      getCustomer(currentPage, employeeId, isAppFilter, isProviderFilter, isStatueFilter, isDateFilter); // Fetch all transactions if search is cleared
      return;
    }

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/customer/search?macAddress=${macAddress}&employee=Marketing`, {
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

  return (
    <>
      <div className='flex ml-5 mt-10 text-[#3E3D3D] font-bold'>
        <h1>Marketing</h1>
      </div>
      <div className={`${styles.reseller_table} `}>
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
            onClick={addCustomerPopUp}
            className="mx-3 text-black hover:text-white border
              border-black hover:bg-black focus:ring-4 focus:outline-none
               focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-black dark:text-black dark:hover:text-white
                dark:hover:bg-black">
            <i className="fa-solid fa-plus mr-4"></i>
            Add Customer</button>
        </div>
        <table className='table-auto w-full mt-4'>
          <thead className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 '>
            <tr className={`${styles.reseller_header}`}>
              <th scope="col" className="py-3">
                <select
                  className="border bg-[#d1d1d1] border-gray-300 rounded  py-1 text-sm focus:outline-none"
                  onChange={(e) => handleFilterEmployee(e.target.value)}
                  defaultValue=""
                >
                  <option value="Employees" >Employees</option>
                  {isAllEmployees.map((employees) => (
                    <option value={employees.name}>{employees.name}</option>

                  ))}
                </select>
              </th>
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
              <th scope="col" className="py-3">Provider Price</th>
              <th scope="col" className="py-3">
                <input
                  type="date"
                  className="border bg-[#d1d1d1] border-gray-300 rounded py-1 text-sm focus:outline-none"
                  onChange={(e) => handleFilterDate(e.target.value)} />
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
              <th scope="col" className="py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {isAllCustomer.map((customers, index) => (
              <tr key={index}>
                <td scope="col" className="py-4">{customers.createdBy.name}</td>
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
                <td scope="col" className="py-3">{customers.app}</td>
                <td scope="col" className="py-3">{customers.mac_address}</td>
                <td scope="col" className="py-3">{customers.country}</td>
                <td scope="col" className="py-3">{customers.provider}</td>
                <td scope="col" className="py-3">{customers.price + '' + customers.currency}</td>
                <td scope="col" className="py-3">{customers.createdAt}</td>
                <td scope="col" className="py-3">{customers.statue}</td>
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

        </div>
      </div>



      {isAddCustomer ?
        <form>
          <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-[500px]">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    ADD Customer
                  </h3>
                  <button type="button" onClick={() => setIsAddCustomer(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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


                    <div className='flex items-center justify-center col-span-2'>
                      <div className='w-1/2 mx-5'>
                        <label htmlFor="app" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">App</label>
                        <select onChange={(e) => setApp(e.target.value)} value={app} id="app" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
                          <input type="text" onChange={(e) => setPrice(e.target.value)} value={price} name="macAddress" id="macAddress"
                            className="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                          <select onChange={(e) => setCurrency(e.target.value)} value={currency} id="currency" className="mx-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option>$</option>
                            <option>Euro</option>
                            <option>Corona</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-center col-span-2 mb-3'>
                    <div className='w-1/2 mx-5'>
                      <label htmlFor="status" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Statue</label>
                      <select onChange={(e) => setStatue(e.target.value)} value={statue} id="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Choose a Status</option>
                        <option>Test</option>
                        <option>Sub</option>
                      </select>
                    </div>
                    <div className='w-1/2'>
                      <label htmlFor="macAddress" className="flex mb-2  font-medium text-gray-900 dark:text-white">Date</label>
                      <input type="text" onChange={(e) => setIsCountry(e.target.value)} value={isCountry} name="country" id="country" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Your Country" required="" />

                    </div>
                  </div>

                  <button type="submit"
                    onClick={handleAdd}
                    className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                    {isLoading ?
                      <i className='fas fa-spinner fa-spin text-2xl'></i>
                      : 'Add'}
                  </button>
                  <button type="submit" onClick={() => setIsAddCustomer(false)}
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
                        {email}
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
                        <label htmlFor="countries" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">App</label>
                        <div
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          {app}
                        </div>
                      </div>
                      <div className='w-1/2'>
                        <label htmlFor="macAddress" className="flex mb-2  font-medium text-gray-900 dark:text-white">Mac Address</label>
                        <div
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          {isMacAddress}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center justify-center col-span-2'>
                      <div className='w-1/2 mx-5'>
                        <label htmlFor="provider" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Provider</label>
                        <div
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          {provider}
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
                      <label htmlFor="countries" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">Statue</label>
                      <select onChange={(e) => setStatue(e.target.value)} value={statue} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Choose a Status</option>
                        <option>Test</option>
                        <option>Sub</option>
                      </select>
                    </div>

                    <div className='w-1/2'>
                      <label htmlFor="country" className="flex mb-2  font-medium text-gray-900 dark:text-white">Country</label>
                      <div
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        {isCountry}
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
                  <button type="submit" onClick={() => { setIsEditeCustomer(false); clearInput() }}
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
