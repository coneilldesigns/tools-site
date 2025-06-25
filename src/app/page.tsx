'use client';

import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { pageview } from '@/lib/analytics';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { toolSections } from "@/data/toolSections";
import Link from "next/link";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Track page view when the pathname changes
    pageview(pathname);
  }, [pathname]);

  // Filter out disabled tools and sections with no enabled tools
  const enabledSections = toolSections.filter(section => 
    section.tools.some(tool => tool.enabled)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={toggleSidebar} />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 pt-16 pb-16 relative">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 relative z-30 overflow-y-auto">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">Everyday Tools</h1>
            
            {enabledSections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-white">
                  <span className="mr-3">{section.icon}</span>
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.tools
                    .filter(tool => tool.enabled)
                    .map((tool, toolIndex) => (
                      <Link
                        href={`/${tool.path}`} 
                        key={toolIndex}
                        className="block py-2 px-4 border border-gray-700 hover:bg-gray-800 transition-colors duration-200 rounded-lg"
                      >
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-md font-medium text-white">
                              {tool.name}
                            </h3>
                          </div>
                          <button className="text-sm bg-primary/20 hover:bg-primary/30 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors duration-200">
                            Try this tool
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
                          </button>
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
