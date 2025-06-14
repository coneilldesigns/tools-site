'use client';

import { toolSections } from '../data/toolSections';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out z-40 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0`}>
      <nav className="p-4 h-full overflow-y-auto">
        <ul className="space-y-2">
          {toolSections.map((section, index) => (
            <li key={index} className="mb-4">
              <div className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 font-medium">
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </div>
              <ul className="ml-6 mt-2 space-y-1">
                {section.tools.map((tool, toolIndex) => {
                  const isActive = pathname === `/${tool.path}`;
                  return (
                    <li key={toolIndex}>
                      <Link
                        href={`/${tool.path}`}
                        className={`block px-4 py-2 text-sm rounded transition-colors duration-200 ${
                          isActive
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
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
  );
} 