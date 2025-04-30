import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import { ToastContainer } from 'react-toastify';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
import Admin from './components/Admin/Admin'
import Marketing from './components/Marketing/Marketing'
import Support from './components/Support/Support'
import Provider from './components/Provider/Provider'
import ResellerDetails from './components/ResellerDetails/ResellerDetails'
import SupportResellerDetails from './components/SupportResellerDetails/SupportResellerDetails'


function App() {
  const [count, setCount] = useState(0)
  const routes = createBrowserRouter([

    {
      path: "/",
      element:
        <ProtectedRoutes>
          <Login />
        </ProtectedRoutes>,
    },
    {
      path: "/layout",
      element:
        <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>,
      children: [

        {
          path: "admin",
          element:
            <ProtectedRoutes>
              <Admin />
            </ProtectedRoutes>,



        },
        {
          path: "admin/resellerDetails/:id",
          element:
            <ProtectedRoutes>
              <ResellerDetails />
            </ProtectedRoutes>
        },
        {
          path: "marketing",
          element:
            <ProtectedRoutes>
              <Marketing />
            </ProtectedRoutes>
        },
        {
          path: "support",
          element:
            <ProtectedRoutes>
              <Support />
            </ProtectedRoutes>
        },
        {
          path: "support/resellerDetails/:id",
          element:
            <ProtectedRoutes>
              <SupportResellerDetails />
            </ProtectedRoutes>
        },

      ]
    },

  ])


  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer />
    </>
  )
}

export default App
