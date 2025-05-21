"use client"

import { useState, useEffect } from "react"

export function TermsOfService() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay the animation to ensure it happens after component mount
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`terms-container ${isVisible ? "visible" : ""}`}>
      <style jsx>{`
        .terms-container {
          width: 100%;
          max-width: 800px;
          margin-top: 3rem;
          margin-bottom: 3rem;
          padding: 2rem;
          border-radius: 12px;
          background-color: rgba(17, 24, 39, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid #1f2937;
          position: relative;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .terms-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .terms-container::before {
          content: '';
          position: absolute;
          inset: -1px;
          z-index: -1;
          background: linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6);
          border-radius: 13px;
          opacity: 0.2;
          filter: blur(8px);
          animation: pulse 3s infinite alternate;
        }

        @keyframes pulse {
          0% {
            opacity: 0.1;
          }
          100% {
            opacity: 0.3;
          }
        }

        .terms-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .terms-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .terms-subtitle {
          font-size: 1rem;
          color: #9ca3af;
          margin-top: 0.5rem;
        }

        .terms-content {
          color: #e5e7eb;
          line-height: 1.6;
        }

        .terms-section {
          margin-bottom: 1.5rem;
          animation: fadeIn 0.5s ease forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .terms-section:nth-child(1) { animation-delay: 0.1s; }
        .terms-section:nth-child(2) { animation-delay: 0.2s; }
        .terms-section:nth-child(3) { animation-delay: 0.3s; }
        .terms-section:nth-child(4) { animation-delay: 0.4s; }
        .terms-section:nth-child(5) { animation-delay: 0.5s; }
        .terms-section:nth-child(6) { animation-delay: 0.6s; }
        .terms-section:nth-child(7) { animation-delay: 0.7s; }
        .terms-section:nth-child(8) { animation-delay: 0.8s; }

        .terms-section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: white;
          display: flex;
          align-items: center;
        }

        .terms-section-title::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 10px;
          background: linear-gradient(to right, #06b6d4, #3b82f6);
          border-radius: 50%;
        }

        .terms-section-content {
          padding-left: 18px;
        }

        .terms-link {
          color: #60a5fa;
          text-decoration: none;
          transition: color 0.2s ease;
          position: relative;
        }

        .terms-link:hover {
          color: #93c5fd;
        }

        .terms-link::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          bottom: -2px;
          left: 0;
          background: linear-gradient(to right, #06b6d4, #3b82f6);
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease;
        }

        .terms-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }

        .terms-footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #374151;
          text-align: center;
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .terms-date {
          margin-top: 0.5rem;
          font-style: italic;
        }

        /* Decorative elements */
        .terms-decoration {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(to right, #06b6d4, #3b82f6);
          opacity: 0.05;
          filter: blur(40px);
          z-index: -1;
        }

        .terms-decoration-1 {
          top: -50px;
          right: -50px;
        }

        .terms-decoration-2 {
          bottom: -50px;
          left: -50px;
          background: linear-gradient(to right, #8b5cf6, #d946ef);
        }

        @media (max-width: 640px) {
          .terms-container {
            padding: 1.5rem;
          }

          .terms-title {
            font-size: 1.5rem;
          }

          .terms-section-title {
            font-size: 1.1rem;
          }
        }
      `}</style>

      {/* Decorative elements */}
      <div className="terms-decoration terms-decoration-1"></div>
      <div className="terms-decoration terms-decoration-2"></div>

      <div className="terms-header">
        <h2 className="terms-title">Terms of Service</h2>
        <p className="terms-subtitle">
          Welcome to AI-knows.me. By using our service, you agree to these terms. Please read them carefully.
        </p>
      </div>

      <div className="terms-content">
        <div className="terms-section">
          <h3 className="terms-section-title">1. Use of Service</h3>
          <div className="terms-section-content">
            <p>
              AI-knows.me provides an AI-powered personality assessment tool. You must provide accurate information and
              maintain the security of your account. Our service uses advanced AI, LLMs, and search data to generate a
              unique profile based on your traits and public presence.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h3 className="terms-section-title">2. Privacy</h3>
          <div className="terms-section-content">
            <p>
              Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect,
              use, and disclose your personal information. We use AI analysis to process your data and generate
              insights, but we implement strict security measures to protect your information.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h3 className="terms-section-title">3. Intellectual Property</h3>
          <div className="terms-section-content">
            <p>
              The content, features, and functionality of AI-knows.me are owned by us and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual property laws. The AI-generated
              profiles, badges, and scores are part of our proprietary system and may not be reproduced without
              permission.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h3 className="terms-section-title">4. User Conduct</h3>
          <div className="terms-section-content">
            <p>When using our service, you agree not to:</p>
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li style={{ marginBottom: "8px" }}>
                Use the service for any illegal purpose or in violation of any laws
              </li>
              <li style={{ marginBottom: "8px" }}>Attempt to gain unauthorized access to any part of the service</li>
              <li style={{ marginBottom: "8px" }}>
                Interfere with or disrupt the integrity or performance of the service
              </li>
              <li style={{ marginBottom: "8px" }}>
                Harass, abuse, or harm another person through the use of our service
              </li>
              <li style={{ marginBottom: "8px" }}>Submit false or misleading information</li>
            </ul>
          </div>
        </div>

        <div className="terms-section">
          <h3 className="terms-section-title">5. Termination</h3>
          <div className="terms-section-content">
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or
              liability, for any reason, including if you breach the Terms. Upon termination, your right to use the
              Service will cease immediately. Your profile may be removed from our Hall of Fame and any other public
              displays.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h3 className="terms-section-title">6. Limitation of Liability</h3>
          <div className="terms-section-content">
            <p>
              To the maximum extent permitted by law, in no event shall AI-knows.me, its directors, employees, partners,
              agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or
              punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
              losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h3 className="terms-section-title">7. Changes to Terms</h3>
          <div className="terms-section-content">
            <p>
              We reserve the right to modify or replace these Terms at any time. It is your responsibility to check the
              Terms periodically for changes. Your continued use of the Service following the posting of any changes to
              the Terms constitutes acceptance of those changes.
            </p>
          </div>
        </div>

        <div className="terms-section">
          <h3 className="terms-section-title">8. Contact Us</h3>
          <div className="terms-section-content">
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:davidmrdev@gmail.com" className="terms-link">
                davidmrdev@gmail.com
              </a>
              . We are committed to addressing any concerns you may have about our service.
            </p>
          </div>
        </div>
      </div>

      <div className="terms-footer">
        <p>
          By using AI-knows.me, you acknowledge that you have read and understood these Terms of Service and agree to be
          bound by them.
        </p>
        <p className="terms-date">Last updated: May 20, 2025</p>
      </div>
    </div>
  )
}
export default TermsOfService