'use client';

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function ToolLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={toggleSidebar} />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 pt-16 md:pb-15 relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 relative z-30 overflow-y-auto">
          <div className="mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
} 