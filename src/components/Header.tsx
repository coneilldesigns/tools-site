'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open menu</span>
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/everyday-tools-logo.svg"
                  alt="Everyday Tools Logo"
                  width={32}
                  height={32}
                  className="dark:invert"
                  priority
                />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Everyday Tools
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isActive('/about') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isActive('/contact') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Contact
            </Link>
            <Link 
              href="/privacy-policy"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isActive('/privacy-policy') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Privacy
            </Link>
            <Link 
              href="/terms"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isActive('/terms') ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 