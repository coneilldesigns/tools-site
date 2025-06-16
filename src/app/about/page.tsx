import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Free Online Tools',
  description: 'Learn about our mission to provide free, easy-to-use online tools for everyday tasks and calculations.',
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About Us</h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            We are dedicated to providing free, easy-to-use online tools that help people with their everyday tasks and calculations. Our goal is to make complex calculations and conversions simple and accessible to everyone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <p className="mb-4">Our website features a wide range of tools across several categories:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Unit & Measurement Converters</li>
            <li>Time & Date Tools</li>
            <li>Text & Writing Tools</li>
            <li>Math & Number Tools</li>
            <li>Business & Productivity Tools</li>
            <li>Design & Web Tools</li>
            <li>Language & Learning Tools</li>
            <li>Privacy & Security Tools</li>
            <li>Fun & Random Tools</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="mb-4">We are committed to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing accurate and reliable tools</li>
            <li>Maintaining a user-friendly interface</li>
            <li>Ensuring fast and responsive performance</li>
            <li>Protecting user privacy and data</li>
            <li>Regularly updating and improving our tools</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
          <p className="mb-4">Our tools stand out because they are:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Free to use with no hidden costs</li>
            <li>Accessible on any device</li>
            <li>No registration required</li>
            <li>Regularly maintained and updated</li>
            <li>Designed with user experience in mind</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Support Us</h2>
          <p className="mb-4">
            We maintain this website through advertising revenue. By using our tools, you help us continue providing free services to everyone. If you find our tools useful, please consider disabling your ad blocker while using our site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            We value your feedback and suggestions. If you have any questions, comments, or ideas for new tools, please don&apos;t hesitate to contact us through our contact page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We&apos;re committed to providing a seamless experience for all users.
          </p>
        </section>
      </div>
    </div>
  );
} 