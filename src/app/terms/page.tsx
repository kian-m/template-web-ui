import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Debark',
  description: 'Terms of Service for using Debark.',
};

export default function TermsPage() {
  return (
    <main className="prose dark:prose-invert container mx-auto max-w-3xl p-8">
      <h1>Terms of Service</h1>
      <p>
        By accessing or using Debark, you agree to be bound by these Terms of Service. If you do not
        agree with any part of the terms, you may not use our services.
      </p>
      <h2>Use of Service</h2>
      <p>
        You agree to use the service in compliance with all applicable laws and regulations and not
        to misuse the platform or attempt to interfere with its operation.
      </p>
      <h2>Data</h2>
      <p>
        You retain ownership of your data. By using the service, you grant us permission to process
        the data as described in our Privacy Policy.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the service constitutes
        acceptance of the revised terms.
      </p>
    </main>
  );
}
