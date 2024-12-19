import Sidebar from "./Sidebar";
import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { logout } = useAuthStore();
  const user=localStorage.getItem("auth_store");
  const imageUser=localStorage.getItem("image");
  console.log(user.message,user);
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
      <Sidebar userRole={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            {user === "admin" ? "Admin Dashboard" : "User Dashboard"}
          </h1>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 bg-gray-100 p-2 rounded-full"
            >
              {user === "admin" ? (
                <img
                  src="/adminProfile.png"
                  alt="Profile Admin"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <img
                  src={`https://teamwork-project.onrender.com/uploads/${imageUser}`}
                  alt="Profile User"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm font-medium">
                {user || "Admin"}
              </span>
            </button>
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 bg-white border shadow-lg mt-2 rounded p-2 w-48">
                <Link
                  to={"/SettingsUser"}
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
