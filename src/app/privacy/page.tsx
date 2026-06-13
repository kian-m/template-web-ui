import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Debark',
  description: 'Privacy Policy for Debark.',
};

export default function PrivacyPage() {
  return (
    <main className="prose dark:prose-invert container mx-auto max-w-3xl p-8">
      <h1>Privacy Policy</h1>
      <p>
        This Privacy Policy explains how Debark collects, uses, and protects your information. By
        using our services, you consent to the data practices described in this policy.
      </p>
      <h2>Information Collection</h2>
      <p>
        We collect information you provide directly and data generated from your use of the service
        to improve functionality and user experience.
      </p>
      <h2>Cookies</h2>
      <p>
        We use cookies to remember your preferences and analyze traffic. You can control cookies
        through your browser settings.
      </p>
      <h2>Contact</h2>
      <p>For questions about this policy, contact us at hello@debark.ai.</p>
    </main>
  );
}
