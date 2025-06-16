import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
// import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

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
        <meta name="google-adsense-account" content="ca-pub-7722207431324039" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9RQM1SLE8W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9RQM1SLE8W');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7722207431324039"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
