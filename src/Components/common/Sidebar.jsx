// src/components/common/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  Settings,
  LogOut,
  BookOpen
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Patients', icon: Users, path: '/patients' },
    { title: 'AI Diagnostics', icon: Stethoscope, path: '/diagnostics' },
    { title: 'Training Sandbox', icon: BookOpen, path: '/sandbox' },
    { title: 'Records', icon: FileText, path: '/records' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-sm transition-transform duration-300 z-20 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="h-full flex flex-col">
        <div className="h-[69px] flex items-center justify-center border-b">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
        </div>

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    currentPath === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 w-full px-3 py-2">
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;