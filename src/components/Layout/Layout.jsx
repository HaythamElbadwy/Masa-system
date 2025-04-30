import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

export default function Layout() {
  const [first, setfirst] = useState()
  useEffect(() => { }, [])

  return (
    <>
     <Navbar />

      <Outlet />

      <Footer />
    </>
  )
}
