'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        
        {/* Main Content */}
        <main 
          className="flex-1 p-6 md:p-10 overflow-y-auto" 
          style={{ 
            marginTop: '4rem',
            height: 'calc(100vh - 7rem)',
            maxHeight: 'calc(100vh - 7rem)'
          }}
        >
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
} 