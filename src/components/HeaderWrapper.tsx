'use client';

import { useState } from 'react';
import Header from './Header';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeaderWrapper() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <>
      <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-800">
          <div className="flex flex-col h-full">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-4 px-4">
              <Link 
                href="/about"
                className={`text-lg font-medium transition-colors hover:text-blue-500 ${
                  isActive('/about') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact"
                className={`text-lg font-medium transition-colors hover:text-blue-500 ${
                  isActive('/contact') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/privacy-policy"
                className={`text-lg font-medium transition-colors hover:text-blue-500 ${
                  isActive('/privacy-policy') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Privacy
              </Link>
              <Link 
                href="/terms"
                className={`text-lg font-medium transition-colors hover:text-blue-500 ${
                  isActive('/terms') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Terms
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
} 