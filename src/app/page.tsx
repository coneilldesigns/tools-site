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
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enabledSections.map((section) => (
            <div key={section.title} className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.tools
                  .filter(tool => tool.enabled)
                  .map((tool) => (
                    <Link
                      key={tool.path}
                      href={`/${tool.path}`}
                      className="block p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                      <p className="text-gray-300 mt-1">{tool.seo.description}</p>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
