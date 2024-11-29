import React from 'react'
import { Outlet, useParams } from 'react-router-dom'

const AdminDashboard = () => {
  const path=window?.location?.pathname;

  return (
    <>
    {path==="admin-dashboard" && <Home/>}
    <Outlet />
    </>

  )
}

export default AdminDashboard
