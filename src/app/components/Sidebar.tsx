'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toolSections } from '@/app/data/toolSections';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-16 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-auto lg:z-auto`}
        style={{ height: 'calc(100vh)', paddingTop: '4rem', paddingBottom: '3.5rem' }}
      >
        <div className="h-full overflow-y-auto py-4 px-3">
          <nav className="space-y-6">
            {toolSections.map((section, index) => (
              <div key={index}>
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {section.icon} {section.title}
                </h3>
                <div className="mt-2 space-y-1">
                  {section.tools.map((tool, toolIndex) => {
                    const isActive = pathname === `/tools/${tool.path}`;
                    return (
                      <Link
                        key={toolIndex}
                        href={`/tools/${tool.path}`}
                        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {tool.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
} 