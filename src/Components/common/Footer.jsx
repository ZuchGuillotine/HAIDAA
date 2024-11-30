// src/components/common/Footer.jsx
import React from 'react';
import Link from 'next/link';

const Footer = ({ isSidebarOpen }) => {
  return (
    <footer className={`bg-white border-t transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/hipaa" className="text-sm text-gray-600 hover:text-gray-900">
                  HIPAA Compliance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-sm text-gray-600 hover:text-gray-900">
                  Training Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">About</h3>
            <p className="text-sm text-gray-600">
              © 2024 Healthcare AI Assistant. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Licensed for medical professional use only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;