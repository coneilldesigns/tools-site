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
      <div className="flex flex-1 pt-16 pb-16 relative">
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 relative z-30 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
} 