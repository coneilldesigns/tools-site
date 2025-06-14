'use client';

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { toolSections } from "@/data/toolSections";
import Link from "next/link";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={toggleSidebar} />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 pt-16 pb-16 relative">
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 relative z-30 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Tools & Utilities</h1>
            
            {toolSections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <span className="mr-3">{section.icon}</span>
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.tools.map((tool, toolIndex) => (
                    <Link 
                      href={`/${tool.path}`} 
                      key={toolIndex}
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        Use tool
                        <svg 
                          className="w-4 h-4 ml-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
