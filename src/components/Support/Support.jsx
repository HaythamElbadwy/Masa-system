import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './Support.module.css';
import ResellerSupportEmplyees from '../ResellerSupportEmplyees/ResellerSupportEmplyees';
import CustomerSupportEmplyees from '../CustomerSupportEmplyees/CustomerSupportEmplyees';
import AllReseller from '../AllReseller/AllReseller';

export default function Support() {
  const [chooseAdmin, setChooseAdmin] = useState('My Reseller');
  const [openDropDown, setOpenDropDown] = useState(false);

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

  // Toggle the dropdown open/close
  const toggleDropdownSupport = () => setOpenDropDown((prev) => !prev);

  // Handle selecting an option from the dropdown
  const handleSelectAdmin = (option) => {
    setChooseAdmin(option);
    setOpenDropDown(false); // Close the dropdown after selection
  };

  // Admin options list
  const adminOptions = ['My Reseller', 'Customers', 'All Reseller'];

  // Function to render the selected component based on the option
  const renderComponent = () => {
    switch (chooseAdmin) {
      case 'My Reseller':
        return <ResellerSupportEmplyees />;
      case 'Customers':
        return <CustomerSupportEmplyees />;
        case 'All Reseller':
          return <AllReseller />;

      default:
        return <div>No Component Found</div>;
    }
  };

  return (
    <section className='mt-24'>
      <div className='flex ml-16 mb-8 text-[#3E3D3D] font-bold text-2xl'>
        <h1>Support</h1>
      </div>
      <div className='mr-[62rem]'>
        <button
          id="dropdownDefaultButton"
          onClick={toggleDropdownSupport}
          className={`${styles.dropdownDefaultButton} text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center`}
          type="button"
        >
          {chooseAdmin}
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
        {openDropDown && (
          <div
            id="dropdownOne"
            className={`${styles.dropdown} absolute  mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}
          >
            <ul className={`${styles.dropDownSelected} py-2 text-sm text-gray-700 dark:text-gray-200`}>
              {adminOptions.map((option) => (
                <li key={option}>
                  <a
                    href="#"
                    onClick={() => handleSelectAdmin(option)}
                    className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {option}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}


      </div>
      {/* Render the selected admin component */}
      {renderComponent()}
    </section>

  );
}
