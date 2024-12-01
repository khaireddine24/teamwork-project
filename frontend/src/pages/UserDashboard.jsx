import React from "react";
import { Outlet } from "react-router-dom";
import HomeUser from "./HomeUser";

const UserDashboard = () => {
  const path=window?.location?.pathname;
  return (
    <>
    {path==="user-dashboard" && <HomeUser/>}
    <Outlet/>
    </>
  );
};

export default UserDashboard;
