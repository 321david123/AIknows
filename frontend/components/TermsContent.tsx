"use client"

import { motion } from "framer-motion"

export default function TermsContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
      <div className="space-y-6 text-gray-700">
        <p>Welcome to AI-knows.me. By using our service, you agree to these terms. Please read them carefully.</p>

        <h2 className="text-2xl font-semibold mt-6">1. Use of Service</h2>
        <p>
          AI-knows.me provides an AI-powered personality assessment tool. You must provide accurate information and
          maintain the security of your account.
        </p>

        <h2 className="text-2xl font-semibold mt-6">2. Privacy</h2>
        <p>
          Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use,
          and disclose your personal information.
        </p>

        <h2 className="text-2xl font-semibold mt-6">3. Intellectual Property</h2>
        <p>
          The content, features, and functionality of AI-knows.me are owned by us and are protected by international
          copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>

        <h2 className="text-2xl font-semibold mt-6">4. Termination</h2>
        <p>
          We may terminate or suspend your account and access to the Service immediately, without prior notice or
          liability, for any reason.
        </p>

        <h2 className="text-2xl font-semibold mt-6">5. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. It is your responsibility to check the
          Terms periodically for changes.
        </p>

        <h2 className="text-2xl font-semibold mt-6">6. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at davidmrdev@gmail.com.</p>
      </div>
    </motion.div>
  )
}

