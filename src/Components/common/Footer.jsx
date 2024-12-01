// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ isSidebarOpen }) => {
  return (
    <footer className={`bg-white border-t transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/hipaa" className="text-sm text-gray-600 hover:text-gray-900">
                  HIPAA Compliance
                </Link>
              </li>
            </ul>
          </div>
          {/* Add other sections as needed */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;