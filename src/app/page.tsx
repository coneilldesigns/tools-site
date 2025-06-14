'use client';

import Link from "next/link";
import Script from "next/script";
import DashboardLayout from "./components/DashboardLayout";
import { toolSections } from "./data/toolSections";
import AdWrapper from "./components/AdWrapper";

export default function Home() {
  return (
    <DashboardLayout>
      {/* Google AdSense Script - Only loaded in production */}
      {process.env.NODE_ENV === 'production' && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}

      <div className="space-y-8">
        {/* Welcome Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Tools Site
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your one-stop destination for all your online tools and utilities. Browse through our collection of free, easy-to-use tools.
          </p>
        </section>

        {/* Tools Grid */}
        <div className="grid gap-8">
          {toolSections.map((section, index) => (
            <div key={index}>
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                  <span>{section.icon}</span>
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.tools.map((tool, toolIndex) => (
                    <Link 
                      key={toolIndex}
                      href={`/tools/${tool.path}`}
                      className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                      <span className="text-blue-600 dark:text-blue-400 text-sm">
                        Try it now →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Add ad card after each section except the last one */}
              {index < toolSections.length - 1 && (
                <AdWrapper 
                  slot={`ad-slot-${index + 1}`}
                  format="horizontal"
                  style={{ minHeight: '90px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
