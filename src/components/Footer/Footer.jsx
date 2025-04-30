import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './Footer.module.css';

export default function Footer() {
  const [first, setfirst] = useState()
  useEffect(() => { }, [])

  return (
    <footer className='w-full h-10 fixed bottom-0 z-50'>
      <div className='mt-2 text-start flex items-center justify-center'>
        <i className="fa-regular fa-copyright"></i>
        <h1 className='ml-1 mb-1'>Copyright Mira,All Rights Reserved</h1>
      </div>
    </footer>
  )
}
