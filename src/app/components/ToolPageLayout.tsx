'use client';

import { ReactNode } from 'react';
import DashboardLayout from './DashboardLayout';
import AdWrapper from './AdWrapper';

interface ToolPageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function ToolPageLayout({ children, title, description }: ToolPageLayoutProps) {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Tool Header */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </section>

        {/* Top Ad */}
        <AdWrapper 
          slot="tool-top-ad"
          format="horizontal"
          style={{ minHeight: '90px' }}
        />

        {/* Tool Content */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {children}
        </section>

        {/* Bottom Ad */}
        <AdWrapper 
          slot="tool-bottom-ad"
          format="horizontal"
          style={{ minHeight: '90px' }}
        />

        {/* Related Tools */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="/tools/feet-to-inches" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-white">Feet to Inches Converter</h3>
            </a>
            <a href="/tools/cm-to-inches" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-white">CM to Inches Converter</h3>
            </a>
            <a href="/tools/miles-to-km" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-white">Miles to KM Converter</h3>
            </a>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
} 