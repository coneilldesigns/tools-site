import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Free Online Tools',
  description: 'Get in touch with us for questions, feedback, or suggestions about our free online tools.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <ContactForm />
    </div>
  );
} 