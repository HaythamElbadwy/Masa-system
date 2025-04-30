import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './SupportDropDown.module.css';
import ResellerSupport from '../ResellerSupport/ResellerSupport';
import CustomerSupport from '../CustomerSupport/CustomerSupport';

export default function SupportDropDown() {
  const [chooseAdmin, setChooseAdmin] = useState('Reseller');
  const [openDropDown, setOpenDropDown] = useState(false);

  // Toggle the dropdown open/close
  const toggleDropdownSupport = () => setOpenDropDown((prev) => !prev);

  // Handle selecting an option from the dropdown
  const handleSelectAdmin = (option) => {
    setChooseAdmin(option);
    setOpenDropDown(false); // Close the dropdown after selection
  };

  // Admin options list
  const adminOptions = ['Reseller', 'Customers',];

  // Function to render the selected component based on the option
  const renderComponent = () => {
    switch (chooseAdmin) {
      case 'Reseller':
        return <ResellerSupport />;
      case 'Customers':
        return <CustomerSupport />;

      default:
        return <div>No Component Found</div>;
    }
  };

  return (
    <section className='mt-8'>
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
