'use client';

import { toolSections } from '../data/toolSections';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // Filter out disabled tools and sections with no enabled tools
  const enabledSections = useMemo(() => 
    toolSections
      .map(section => ({
        ...section,
        tools: section.tools.filter(tool => tool.enabled)
      }))
      .filter(section => section.tools.length > 0),
    []
  );

  // Initialize expanded sections based on active path or first section
  useEffect(() => {
    const initialExpanded: { [key: string]: boolean } = {};
    
    // Find section containing active tool
    const activeSection = enabledSections.find(section => 
      section.tools.some(tool => `/${tool.path}` === pathname)
    );

    if (activeSection) {
      // Expand section with active tool
      initialExpanded[activeSection.title] = true;
    } else if (enabledSections.length > 0) {
      // If no active tool, expand first section
      initialExpanded[enabledSections[0].title] = true;
    }

    setExpandedSections(initialExpanded);
  }, [pathname, enabledSections]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`h-[calc(100vh-125px)] fixed left-0 top-16 bottom-0 w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <nav className="h-full overflow-y-auto">
          <ul className="space-y-2">
            {enabledSections.map((section, index) => (
              <li key={index} className="mb-0">
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center w-full p-4 text-base text-gray-700 dark:text-gray-200 transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                >
                  <span className="mr-2">{section.icon}</span>
                  <span className="flex-1 text-left">{section.title}</span>
                  <svg 
                    className={`w-3 h-3 transition-transform duration-200 ${expandedSections[section.title] ? 'rotate-180' : ''}`} 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 10 6"
                  >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
                </button>
                <ul className={`py-2 space-y-1 transition-all duration-200 ${expandedSections[section.title] ? 'block' : 'hidden'}`}>
                  {section.tools.map((tool, toolIndex) => {
                    const isActive = pathname === `/${tool.path}`;
                    return (
                      <li key={toolIndex}>
                        <Link
                          href={`/${tool.path}`}
                          className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                            isActive
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                          onClick={onClose}
                        >
                          {tool.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
} 