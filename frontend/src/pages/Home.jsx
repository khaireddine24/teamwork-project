import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const HomePage = () => {
  const [stats, setStats] = useState({
    pendingApproval: 0,
    suppliers: 0,
    employees: 0,
  });
  const { user } = useAuthStore(); 

  // Fetch the data when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, suppliersRes, employeesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/non-admins", {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axios.get("http://localhost:5000/api/supplier", {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ]);
 

        

        // Set state with the total counts
        setStats({
          pendingApproval: pendingRes.data.users.filter(
            (user) => !user.isAccessGranted
          ).length,
          suppliers: suppliersRes.data.length,
          employees: employeesRes.length,
        });
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-6 space-y-6">

 

      {/* Stats Section with Tailwind CSS Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pending Approval Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
          <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
          <p className="text-4xl font-bold text-blue-500 mt-2">{stats.pendingApproval}</p>
          <p className="text-gray-500 mt-1">New accounts waiting for approval.</p>
        </div>

        {/* Suppliers Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
          <h3 className="text-lg font-semibold text-gray-700">Suppliers</h3>
          <p className="text-4xl font-bold text-green-500 mt-2">{stats.suppliers}</p>
          <p className="text-gray-500 mt-1">Total registered suppliers.</p>
        </div>

       
      </div>


    </div>
  );
};

export default HomePage;
