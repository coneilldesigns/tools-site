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

  // Filter out disabled tools and sections with no enabled tools
  const enabledSections = toolSections
    .map(section => ({
      ...section,
      tools: section.tools.filter(tool => tool.enabled)
    }))
    .filter(section => section.tools.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={toggleSidebar} />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 pt-16 pb-16 relative">
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 relative z-30 overflow-y-auto">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold mb-8">Everyday Tools</h1>
            
            {enabledSections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <span className="mr-3">{section.icon}</span>
                  {section.title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 border border-gray-200 dark:border-gray-700">
                  {section.tools.map((tool, toolIndex) => (
                    <Link 
                      href={`/${tool.path}`} 
                      key={toolIndex}
                      className={`block p-4 border-r border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-center aspect-square md:aspect-square lg:aspect-square [&:nth-child(1):nth-last-child(1)]:aspect-[2/1] [&:nth-child(1):nth-last-child(2)]:aspect-[2/1] [&:nth-child(2):nth-last-child(1)]:aspect-[2/1] ${
                        toolIndex % 2 === 1 ? 'border-r-0' : ''
                      } lg:border-r ${
                        toolIndex % 4 === 3 ? 'lg:border-r-0' : ''
                      } ${
                        Math.floor(toolIndex / 2) === Math.floor((section.tools.length - 1) / 2) ? 'border-b-0' : ''
                      }`}
                    >
                      <div className="h-full flex flex-col justify-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
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
                      </div>
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
