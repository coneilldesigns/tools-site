import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import HeaderWrapper from "@/components/HeaderWrapper";
// import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: {
    template: '%s | Everyday Tools',
    default: 'Everyday Tools - Free Online Tools',
  },
  description: "A collection of free online tools and utilities for everyday tasks. Convert units, calculate dates, format text, and more.",
  keywords: "online tools, utilities, converters, calculators, free tools",
  authors: [{ name: 'CO' }],
  creator: 'CO',
  publisher: 'Everyday Tools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.everyday-tools.dev/'),
  openGraph: {
    type: 'website',
    siteName: 'Everyday Tools',
    title: 'Everyday Tools - Free Online Tools',
    description: 'A collection of free online tools and utilities for everyday tasks. Convert units, calculate dates, format text, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Everyday Tools - Free Online Tools',
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
      <head>
        {/* Resource hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://fundingchoicesmessages.google.com" />
        
        {/* Meta tags */}
        <meta name="google-adsense-account" content="ca-pub-7722207431324039" />
        <meta name="theme-color" content="#111827" />
        
        {/* Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('ServiceWorker registration successful');
                }, function(err) {
                  console.log('ServiceWorker registration failed: ', err);
                });
              });
            }
          `}
        </Script>

        {/* Google Analytics - Load with lowest priority */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9RQM1SLE8W"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9RQM1SLE8W', {
              'send_page_view': false
            });
            document.addEventListener('DOMContentLoaded', function() {
              gtag('event', 'page_view');
            });
          `}
        </Script>

        {/* Google Ads - Load with lowest priority */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7722207431324039"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={inter.className}>
        <HeaderWrapper />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
