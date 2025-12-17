import Layout from "@/components/layout/Layout";

const TermsOfService = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using JMC Academics ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              JMC Academics provides online educational resources, tutorials, courses, and learning materials focused on mathematics and related subjects. Our services include:
            </p>
            <ul className="list-disc pl-6">
              <li>Access to digital library resources</li>
              <li>Interactive tutorials and courses</li>
              <li>Educational content and study materials</li>
              <li>Premium subscription services (JMC Plus)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-medium mb-2">Account Creation</h3>
            <p>To access certain features, you may need to create an account. You agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-medium mb-2">Account Termination</h3>
            <p>
              We reserve the right to terminate or suspend your account at our discretion, with or without notice, for conduct that violates these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payment</h2>
            <h3 className="text-xl font-medium mb-2">Premium Services</h3>
            <p>
              Some services require payment of fees. By subscribing, you agree to pay all applicable fees and charges.
            </p>

            <h3 className="text-xl font-medium mb-2">Billing</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Payments are processed securely through third-party providers</li>
              <li>Subscription fees are billed in advance</li>
              <li>You are responsible for all taxes and fees</li>
              <li>Refunds are provided according to our refund policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use Policy</h2>
            <p>You agree not to use our services to:</p>
            <ul className="list-disc pl-6">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Distribute harmful or malicious content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our services</li>
              <li>Use automated tools to access content without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <h3 className="text-xl font-medium mb-2">Our Content</h3>
            <p>
              All content on JMC Academics, including text, graphics, logos, and software, is our property or that of our licensors and is protected by copyright and other intellectual property laws.
            </p>

            <h3 className="text-xl font-medium mb-2">User Content</h3>
            <p>
              By posting content on our platform, you grant us a non-exclusive, royalty-free license to use, modify, and distribute your content in connection with our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimers</h2>
            <p>
              Our services are provided "as is" without warranties of any kind. We do not guarantee that our services will be uninterrupted, error-free, or meet your specific requirements. Educational content is provided for informational purposes only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of our services or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of Malawi, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> legal@jmcacademics.com</p>
              <p><strong>Address:</strong> Malawi</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;