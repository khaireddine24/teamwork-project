import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
 
const Layout = () => {
  return (
    <div className='flex'>
        <div className='w-16 md:w-56 left-0 top-0 z-10 h-screen border-r pt-8 px-4 bg-white'>
            <Sidebar/>
        </div>
        <div className='w-full ml-16 md:md-56'>
            <Header/>
            <main className='p-5'>
            <Outlet/>
            </main>
        </div>
           
    </div>
    
  )
}

export default Layout