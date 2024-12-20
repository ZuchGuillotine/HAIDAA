
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Sidebar, Footer } from "../common";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isProfileDropdownOpen={isProfileDropdownOpen}
        toggleProfileDropdown={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
      />

      <Sidebar isOpen={isSidebarOpen} />

      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      <Footer isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default MainLayout;
