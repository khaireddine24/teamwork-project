import React, { useState, useEffect } from "react"; // Import useState and useEffect
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const EmployeesPage = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState(null);
  const {user}=useAuthStore();
  const token = localStorage.getItem("auth_token");


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users who are not admins
        const response = await axios.get("http://localhost:5000/users");
        const allUsers = response.data.users;

        // Separate pending users and approved users
        const pending = allUsers.filter((user) => !user.isAccessGranted);
        setPendingUsers(pending);

        const approved = allUsers.filter((user) => user.isAccessGranted);
        setUsers(approved);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/accept-access/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // Properly pass the token
        }
      );
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
      const approvedUser = pendingUsers.find((user) => user._id === id);
      setUsers((prev) => [...prev, approvedUser]);
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };
  
  const handleDeny = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/deny-access/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // Properly pass the token
        }
      );
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error denying user:", err);
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Employees</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pending Employees</h2>
        {pendingUsers.length > 0 ? (
          <ul>
            {pendingUsers.map((user) => (
              <li key={user._id} className="border p-2 rounded mb-2">
                <div className="flex justify-between items-center">
                  <span>{user.name} - {user.email}</span>
                  <div>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleApprove(user?._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDeny(user._id)}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending employees.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Approved Employees</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user._id} className="border p-2 rounded mb-2">
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No approved employees found.</p>
        )}
      </section>
    </div>
  );
};

export default EmployeesPage;
