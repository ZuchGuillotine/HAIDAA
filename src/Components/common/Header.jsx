// src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, User, ChevronDown } from 'lucide-react';

const Header = ({ toggleSidebar, isProfileDropdownOpen, toggleProfileDropdown }) => {
  return (
    <header className="fixed top-0 right-0 left-0 bg-white shadow-sm z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-800">HAIDAA</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100 relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-3 p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <User className="h-6 w-6" />
              <span>Dr. Sarah Thompson</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile Settings
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Preferences
                </Link>
                <hr className="my-1" />
                <Link href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;