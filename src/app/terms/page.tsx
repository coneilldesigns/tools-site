import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Free Online Tools',
  description: 'Terms of Service for our free online tools website. Learn about the rules and guidelines for using our services.',
};

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 dark:text-gray-300">
            By accessing and using this website, you agree to be bound by these &quot;Terms of Service&quot; and all applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="mb-4">Permission is granted to temporarily use our tools for personal, non-commercial purposes. This license does not include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modifying or copying the materials</li>
            <li>Using the materials for commercial purposes</li>
            <li>Attempting to reverse engineer any software</li>
            <li>Removing any copyright or proprietary notations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="mb-4">
            The tools on this website are provided &quot;as is&quot;. We make no warranties, expressed or implied, and hereby disclaim all warranties of merchantability and fitness for a particular purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p className="mb-4">
            In no event shall we be liable for any damages arising out of the use or inability to use the tools on this website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Materials</h2>
          <p className="mb-4">
            The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate, complete, or current.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
          <p className="mb-4">
            We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
          <p className="mb-4">
            We may revise these terms of service at any time without notice. By using this website, you agree to be bound by the current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p className="mb-4">
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us through our contact page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Last Updated</h2>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
} 