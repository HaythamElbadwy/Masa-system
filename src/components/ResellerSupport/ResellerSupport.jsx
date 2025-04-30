import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './ResellerSupport.module.css';
import { toast } from 'react-toastify';

export default function ResellerSupport() {

  const [isLoading, setIsLoading] = useState(false);
  const [isAllReseller, setIsAllReseller] = useState([]);
  const [searchReseller, setSearchReseller] = useState('');
  /////////////////////// START GET RESELLER FUNCTION////////////////
  const getReseller = async () => {

    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/get?employee=Support`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();


      if (response.ok) {
        setIsAllReseller(data.resellers);
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
      const response = await fetch(`https://masa-system.vercel.app/api/v1/reseller/search?name=${name}&employee=Support`, {
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
      <div className='flex ml-5 mt-10 text-[#3E3D3D] font-bold'>
        <h1>Support</h1>
      </div>
      <div className={`${styles.resellerSupport_table} `}>
        <div className='flex'>
          <div className={`${styles.searchInput} relative w-[50%] m-auto`}>
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>

            </div>
            <input onChange={(e) => getSearchReseller(e.target.value)} type="search" id="default-search" className="block w-full h-11 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search By Name" required />
          </div>

        </div>
        <table className='table-auto w-full mt-4'>
          <thead className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 '>
            <tr className={`${styles.resellerSupport_header}`}>
              <th scope="col" className="py-3">Employees</th>
              <th scope="col" className="py-3">Reseller</th>
              <th scope="col" className="py-3">Account Num</th>
              <th scope="col" className="py-3">Device Num</th>
              <th scope="col" className="py-3">total debt</th>
            </tr>
          </thead>
          <tbody>
            {isAllReseller.map((reseller, index) => (
              <tr key={index}>
                <td scope="col" className="py-4 text-[#3E3D3D]">{reseller.creatorName}</td>
                <td scope="col" className="py-4 text-[#3E3D3D]">{reseller.name}</td>
                <td scope="col" className="py-3 text-[#3E3D3D]">
                  <span className='bg-black w-20 h-7 inline-block rounded-lg text-white'>{reseller.totalAccountNum}</span>
                </td>
                <td scope="col" className="py-3 text-[#3E3D3D]">
                  <span className='bg-black w-20 h-7 inline-block rounded-lg text-white'>{reseller.totalDeviceNum}</span>
                </td>
                <td scope="col" className="py-3 text-[#3E3D3D]">{reseller.totalDebt}</td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

    </>
  )
}
