import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuBox, LuUser, LuMessageSquare, LuCalendar } from 'react-icons/lu';
import { FaSuitcase } from 'react-icons/fa';
import { TbUsers } from 'react-icons/tb';
import axiosInstance from '../api/axiosInstance'; // Ensure this path matches your project structure

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(0);
  const [role, setRole] = useState(null); // State to store user role

  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  // Fetch the user role on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get('/check-auth'); // Fetch user data
        setRole(response.data.user.role); // Set role from response
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, []);

  // Define links based on role
  const BASE_LINKS = [
    { id: 1, path: '/', name: 'Dashboard', icon: <LuBox /> },
    { id: 2, path: '/profile', name: 'Profile', icon: <LuUser /> },
  ];

  const ADMIN_LINKS = [
    { id: 3, path: '/members', name: 'Members', icon: <TbUsers /> },
    { id: 4, path: '/projects', name: 'Projects', icon: <FaSuitcase /> },
    { id: 5, path: '/settings', name: 'Settings', icon: <LuUser /> },
  ];

  const USER_LINKS = [
    { id: 6, path: '/messages', name: 'Messages', icon: <LuMessageSquare /> },
    { id: 7, path: '/calendar', name: 'Calendar', icon: <LuCalendar /> },
  ];

  // Combine links based on role
  const SIDEBAR_LINKS = role === 'admin' ? [...BASE_LINKS, ...ADMIN_LINKS] : [...BASE_LINKS, ...USER_LINKS];

  return (
    <div className='w-10 md:w-56 fixed left-0 top-0 z-10 h-screen border-r pt-8 px-4 bg-white'>
      {/* Logo */}
      <div className='mb-8'>
        <img src='/logo.png' alt="logo" className='w-16 hidden md:flex' />
        <img src='/logo_mini.png' alt="logo_mini" className='w-8 flex md:hidden' />
      </div>
      {/* Logo */}

      {/* Navigation Links */}
      <ul className='mt-6 space-y-6'>
        {SIDEBAR_LINKS.map((link, index) => (
          <li
            key={link.id}
            className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500 ${
              activeLink === index ? 'bg-indigo-100 text-indigo-500' : ''
            }`}
          >
            <Link
              to={link.path}
              className='flex justify-center md:justify-start items-center md:space-x-5'
              onClick={() => handleLinkClick(index)}
            >
              <span>{link.icon}</span>
              <span className='text-sm text-gray-500 hidden md:flex'>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      {/* Navigation Links */}

      {/* Help Section */}
      <div className='w-full absolute bottom-5 left-0 px-4 py-2 cursor-pointer text-center'>
        <p className='flex items-center space-x-2 text-xs text-white py-2 px-5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full'>
          <span>?</span> <span className='hidden md:flex'>Need Help?</span>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
