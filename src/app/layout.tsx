import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Tools & Utilities',
    default: 'Tools & Utilities - Free Online Tools',
  },
  description: "A collection of free online tools and utilities for everyday tasks. Convert units, calculate dates, format text, and more.",
  keywords: "online tools, utilities, converters, calculators, free tools",
  authors: [{ name: 'CO' }],
  creator: 'CO',
  publisher: 'Tools & Utilities',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.everyday-tools.dev/'),
  openGraph: {
    type: 'website',
    siteName: 'Tools & Utilities',
    title: 'Tools & Utilities - Free Online Tools',
    description: 'A collection of free online tools and utilities for everyday tasks. Convert units, calculate dates, format text, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tools & Utilities - Free Online Tools',
    description: 'A collection of free online tools and utilities for everyday tasks. Convert units, calculate dates, format text, and more.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
