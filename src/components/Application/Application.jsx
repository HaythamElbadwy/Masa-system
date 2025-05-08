import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './Application.module.css';
import { toast } from 'react-toastify';
import { theme } from 'flowbite-react';

export default function Application() {
  const [isAddApplications, setIsAddApplications] = useState(false);
  const [isDeleteApplications, setIsDeleteApplications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isName, setIsName] = useState('');
  const [isAllApplications, setIsAllApplications] = useState([]);
  const [applicationId, setApplicationIdId] = useState();
  function addApplications() {
    setIsAddApplications(true)
  }

  function deleteApplicationsPopUp(id) {
    setIsDeleteApplications(true)
    setApplicationIdId(id)
  }

  /////////////////////// START GET APPLICATIONS FUNCTION////////////////
  const getApplications = async () => {

    try {
      const response = await fetch('https://masa-system.vercel.app/api/v1/application/get?q=all', {
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
  /////////////////////// END GET APPLICATIONS FUNCTION////////////////

  ////////////////////////START ADD APPLICATIONS//////////////////////////////

  const addNewApplications = async () => {

    console.log(isName);

    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/application/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name: isName })
      });

      const data = await response.json();

      if (response.ok) {
        getApplications()
        toast.success(data.message, {
          theme: 'dark'
        })
        setIsAddApplications(false)
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
      console.error("Error Saving Application:", err);
    } finally {
      setIsLoading(false)
    }
  };

  function handleAdd(e) {
    e.preventDefault();
    if (isName == '') {
      toast("All faildes is Rquired!")
    } else {
      addNewApplications()
    }

  }

  function clearInput() {
    setIsName('')
  }
  ////////////////////////END ADD APPLICATIONS/////////////////////////////////////

  ///////////////////////START DELETE  Application/////////////////////////////////

  const deleteApplications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/application/delete/${applicationId}`, {
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
        setIsDeleteApplications(false)
        getApplications();
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
      console.error("Error Saving Application:", err);
    } finally {
      setIsLoading(false)
    }
  };
  function handleDelete() {
    deleteApplications(applicationId)
  }
  //////////////////////END DELETE Application///////////////////////////////

  ////////////////////START ACTIVE APPLICATION FUNCTION//////////////////////
  const activeApplication = async (id) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://masa-system.vercel.app/api/v1/application/activate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `sysOM0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, {
          theme: "dark"
        });
        getApplications()
      } else {
        switch (response.status) {
          case 500:
            toast.error(data.message, {
              theme: "dark"
            });
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

  ////////////////////END ACTIVE APPLICATION FUNCTION//////////////////////

  return (
    <>
      <section>
        <div className='flex items-center justify-between mt-10'>
          <div className='text-[#3C3C3C] font-bold'>
            <h2>Applications</h2>
          </div>
          <button type="button"
            onClick={addApplications}
            className={`${styles.addApplication} mx-3 text-white bg-black focus:outline-none focus:ring-4
                           focus:ring-gray-300 font-medium rounded-lg text-sm pl-5 pr-1 py-2.5 
                        dark:bg-gray-800 dark:hover:bg-gray-700
                         dark:focus:ring-gray-700 dark:border-gray-700`}>
            <i className="fa-solid fa-plus mr-4"></i>
          </button>
        </div>

        <div className='pr-[10px]'>
          {isAllApplications.map((app, index) => (
            <div
              key={index}
              className='flex justify-between items-center mt-5 border border-[#AAAAAA] bg-[#F5F5F5] rounded-[10px] p-[10px]'>
              <p>{app.name}</p>
              <div className='flex items-center'>
                <label className="inline-flex items-center mb-1 cursor-pointer mr-3">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    onChange={() => activeApplication(app._id)}
                    checked={app.active ? true : false}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400 dark:peer-checked:bg-red-400"></div>
                </label>
                <button type="button"
                  onClick={() => deleteApplicationsPopUp(app._id)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {isAddApplications ?
          <form>
            <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Add New Application
                    </h3>
                    <button type="button" onClick={() => setIsAddApplications(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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

                    <button
                      //  type="submit"
                      onClick={handleAdd}
                      className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                      {isLoading ?
                        <i className='fas fa-spinner fa-spin text-2xl'></i>
                        : 'Add'}
                    </button>
                    <button type="submit" onClick={() => setIsAddApplications(false)}
                      className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                      Cancel</button>

                  </div>
                </div>
              </div>
            </div>
          </form>
          : ''}

        {isDeleteApplications ?
          <div id="popup-modal" tabindex="-1" className="fixed overflow-y-auto backdrop-blur-sm z-[9999] top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 ">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Applications
                  </h3>
                  <button type="button" onClick={() => setIsDeleteApplications(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="px-4 md:p-5">
                  <div className="grid gap-4 mb-4">
                    <h1 className='text-2xl'>Do you want to Delete Applications?</h1>
                  </div>

                  <button type="submit"
                    onClick={handleDelete}
                    className="text-white mr-5 inline-flex items-center bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                    {isLoading ?
                      <i className='fas fa-spinner fa-spin text-2xl'></i>
                      : 'Yes'}
                  </button>
                  <button type="submit" onClick={() => setIsDeleteApplications(false)}
                    className="text-white mr-5 inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700">
                    No</button>

                </div>
              </div>
            </div>
          </div>

          : ''}
      </section>

    </>
  )
}
