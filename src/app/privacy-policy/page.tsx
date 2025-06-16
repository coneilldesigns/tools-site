import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Free Online Tools',
  description: 'Privacy Policy for our free online tools website. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            This Privacy Policy describes how we collect, use, and handle your personal information when you use our website and tools.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="mb-4">We collect minimal information necessary to provide our services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usage data (how you interact with our tools)</li>
            <li>Device information (browser type, operating system)</li>
            <li>IP address (for security and analytics)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the collected information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Improve user experience</li>
            <li>Analyze usage patterns</li>
            <li>Prevent abuse and ensure security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to improve your experience. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
          <p className="mb-4">
            We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your interests. You can opt out of personalized advertising by visiting Google&apos;s Ads Settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Request correction of your data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of data collection</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us through our contact page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
} 