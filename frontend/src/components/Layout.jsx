import Sidebar from "./Sidebar";
import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar userRole={user?.role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            {user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
          </h1>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 bg-gray-100 p-2 rounded-full"
            >
              {user?.role === "admin" ? (
                <img
                  src="/adminProfile.png"
                  alt="Profile Admin"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <img
                  src={`http://localhost:5000/uploads/${user?.image}`}
                  alt="Profile User"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm font-medium">
                {user?.name || "Admin"}
              </span>
            </button>
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 bg-white border shadow-lg mt-2 rounded p-2 w-48">
                <Link
                  to={"/settings"}
                  className="block text-gray-700 hover:bg-gray-100 p-2 rounded"
                >
                  Settings
                </Link>

                <button
                  className="block text-gray-700 hover:bg-gray-100 p-2 rounded w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
