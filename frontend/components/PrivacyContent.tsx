"use client"

import { useState, useEffect } from "react"

export function PrivacyPolicy() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay the animation to ensure it happens after component mount
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`privacy-container ${isVisible ? "visible" : ""}`}>
      <style jsx>{`
        .privacy-container {
          width: 100%;
          max-width: 800px;
          margin-top: 3rem;
          margin-bottom: 3rem;
          padding: 2rem;
          border-radius: 12px;

          position: relative;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .privacy-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .privacy-container::before {
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

        .privacy-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .privacy-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .privacy-subtitle {
          font-size: 1rem;
          color: #9ca3af;
          margin-top: 0.5rem;
        }

        .privacy-content {
          color: #e5e7eb;
          line-height: 1.6;
        }

        .privacy-section {
          margin-bottom: 1.5rem;
          animation: fadeIn 0.5s ease forwards;
          opacity: 0;
          position: relative;
          padding-left: 20px;
        }

        .privacy-section::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, #06b6d4, transparent);
          border-radius: 3px;
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

        .privacy-section:nth-child(1) { animation-delay: 0.1s; }
        .privacy-section:nth-child(2) { animation-delay: 0.2s; }
        .privacy-section:nth-child(3) { animation-delay: 0.3s; }
        .privacy-section:nth-child(4) { animation-delay: 0.4s; }
        .privacy-section:nth-child(5) { animation-delay: 0.5s; }
        .privacy-section:nth-child(6) { animation-delay: 0.6s; }
        .privacy-section:nth-child(7) { animation-delay: 0.7s; }
        .privacy-section:nth-child(8) { animation-delay: 0.8s; }

        .privacy-section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: white;
          display: flex;
          align-items: center;
        }

        .privacy-section-title::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 24px;
          margin-right: 10px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }

        .icon-data-collection::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2360a5fa' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cpath d='M12 18v-6'%3E%3C/path%3E%3Cpath d='M8 18v-1'%3E%3C/path%3E%3Cpath d='M16 18v-3'%3E%3C/path%3E%3C/svg%3E");
        }

        .icon-data-usage::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2360a5fa' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'%3E%3C/path%3E%3Cpolyline points='3.29 7 12 12 20.71 7'%3E%3C/polyline%3E%3Cline x1='12' y1='22' x2='12' y2='12'%3E%3C/line%3E%3C/svg%3E");
        }

        .icon-data-security::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2360a5fa' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'%3E%3C/path%3E%3C/svg%3E");
        }

        .icon-linkedin::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2360a5fa' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'%3E%3C/path%3E%3Crect x='2' y='9' width='4' height='12'%3E%3C/rect%3E%3Ccircle cx='4' cy='4' r='2'%3E%3C/circle%3E%3C/svg%3E");
        }

        .icon-rights::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2360a5fa' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E");
        }

        .icon-cookies::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2360a5fa' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3C/svg%3E");
        }

        .icon-contact::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2360a5fa' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'%3E%3C/path%3E%3C/svg%3E");
        }

        .privacy-section-content {
          padding-left: 34px;
        }

        .privacy-link {
          color: #60a5fa;
          text-decoration: none;
          transition: color 0.2s ease;
          position: relative;
        }

        .privacy-link:hover {
          color: #93c5fd;
        }

        .privacy-link::after {
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

        .privacy-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }

        .privacy-footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #374151;
          text-align: center;
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .privacy-date {
          margin-top: 0.5rem;
          font-style: italic;
        }

        /* Decorative elements */
        .privacy-decoration {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(to right, #06b6d4, #3b82f6);
          opacity: 0.05;
          filter: blur(40px);
          z-index: -1;
        }

        .privacy-decoration-1 {
          top: -50px;
          right: -50px;
        }

        .privacy-decoration-2 {
          bottom: -50px;
          left: -50px;
          background: linear-gradient(to right, #8b5cf6, #d946ef);
        }

        .privacy-highlight {
          display: inline-block;
          background: linear-gradient(to right, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
          padding: 0 5px;
          border-radius: 3px;
        }

        @media (max-width: 640px) {
          .privacy-container {
            padding: 1.5rem;
          }

          .privacy-title {
            font-size: 1.5rem;
          }

          .privacy-section-title {
            font-size: 1.1rem;
          }

          .privacy-section-content {
            padding-left: 24px;
          }
        }
      `}</style>

      {/* Decorative elements */}
      <div className="privacy-decoration privacy-decoration-1"></div>
      <div className="privacy-decoration privacy-decoration-2"></div>

      <div className="privacy-header">
        <h2 className="privacy-title">Privacy Policy</h2>
        <p className="privacy-subtitle">
          At AI-knows.me, we take your privacy seriously. Here are our key privacy guidelines.
        </p>
      </div>

      <div className="privacy-content">
        <div className="privacy-section">
          <h3 className="privacy-section-title icon-data-collection">Data Collection</h3>
          <div className="privacy-section-content">
            <p>
              We collect only the information necessary to provide you with personalized recommendations. This includes:
            </p>
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li style={{ marginBottom: "8px" }}>Your responses to our questionnaire</li>
              <li style={{ marginBottom: "8px" }}>
                Basic profile information from LinkedIn if you choose to connect your account
              </li>
              <li style={{ marginBottom: "8px" }}>
                Public information that our AI analyzes to generate your unique profile
              </li>
            </ul>
            <p style={{ marginTop: "10px" }}>
              We do not collect unnecessary personal information and strive to minimize data collection to only what is
              required for our service to function effectively.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h3 className="privacy-section-title icon-data-usage">Data Usage</h3>
          <div className="privacy-section-content">
            <p>
              Your data is used solely for generating personalized recommendations and improving our service.
              Specifically, we use your data to:
            </p>
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li style={{ marginBottom: "8px" }}>Create your AI-generated profile and personality assessment</li>
              <li style={{ marginBottom: "8px" }}>Calculate your profile score and assign appropriate badges</li>
              <li style={{ marginBottom: "8px" }}>Improve our AI algorithms and recommendation systems</li>
              <li style={{ marginBottom: "8px" }}>
                Maintain the Hall of Fame leaderboard (only if you opt in to be included)
              </li>
            </ul>
            <p style={{ marginTop: "10px" }}>
              <span className="privacy-highlight">
                We do not sell or share your personal information with third parties
              </span>{" "}
              for marketing or advertising purposes.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h3 className="privacy-section-title icon-data-security">Data Security</h3>
          <div className="privacy-section-content">
            <p>
              We employ industry-standard security measures to protect your data from unauthorized access, alteration,
              or destruction. Our security practices include:
            </p>
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li style={{ marginBottom: "8px" }}>Encryption of sensitive data both in transit and at rest</li>
              <li style={{ marginBottom: "8px" }}>Regular security audits and vulnerability assessments</li>
              <li style={{ marginBottom: "8px" }}>Strict access controls for our staff and systems</li>
              <li style={{ marginBottom: "8px" }}>Continuous monitoring for suspicious activities</li>
            </ul>
            <p style={{ marginTop: "10px" }}>
              In the event of a data breach that affects your personal information, we will notify you promptly in
              accordance with applicable laws.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h3 className="privacy-section-title icon-linkedin">LinkedIn Integration</h3>
          <div className="privacy-section-content">
            <p>
              If you choose to connect your LinkedIn account, we only access the basic profile information necessary for
              our service. This includes:
            </p>
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li style={{ marginBottom: "8px" }}>Your name and profile picture</li>
              <li style={{ marginBottom: "8px" }}>Professional headline and current position</li>
              <li style={{ marginBottom: "8px" }}>Industry and location</li>
            </ul>
            <p style={{ marginTop: "10px" }}>
              <span className="privacy-highlight">We do not post on your behalf or access your connections</span>. You
              can revoke our access to your LinkedIn account at any time through your LinkedIn settings.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h3 className="privacy-section-title icon-rights">Your Rights</h3>
          <div className="privacy-section-content">
            <p>You have the right to:</p>
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li style={{ marginBottom: "8px" }}>Access your personal information that we hold</li>
              <li style={{ marginBottom: "8px" }}>Correct inaccurate or incomplete information</li>
              <li style={{ marginBottom: "8px" }}>Delete your personal information (the "right to be forgotten")</li>
              <li style={{ marginBottom: "8px" }}>Request a copy of all the data we hold about you</li>
              <li style={{ marginBottom: "8px" }}>Opt out of the Hall of Fame leaderboard at any time</li>
              <li style={{ marginBottom: "8px" }}>Withdraw consent for data processing where applicable</li>
            </ul>
            <p style={{ marginTop: "10px" }}>
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:davidmrdev@gmail.com" className="privacy-link">
                davidmrdev@gmail.com
              </a>
              . We will respond to your request within 30 days.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h3 className="privacy-section-title icon-cookies">Cookies</h3>
          <div className="privacy-section-content">
            <p>We use cookies to enhance your experience on our site. These cookies help us:</p>
            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <li style={{ marginBottom: "8px" }}>Remember your login status and preferences</li>
              <li style={{ marginBottom: "8px" }}>Understand how you use our website</li>
              <li style={{ marginBottom: "8px" }}>Improve our service based on usage patterns</li>
              <li style={{ marginBottom: "8px" }}>Provide personalized features and content</li>
            </ul>
            <p style={{ marginTop: "10px" }}>
              You can choose to disable cookies in your browser settings, but this may affect some functionality of our
              service. We provide a cookie banner that allows you to select your cookie preferences when you first visit
              our site.
            </p>
          </div>
        </div>

        <div className="privacy-section">
          <h3 className="privacy-section-title icon-contact">Contact Us</h3>
          <div className="privacy-section-content">
            <p>
              For more detailed information about our privacy practices or to address any concerns, please contact our
              privacy team at{" "}
              <a href="mailto:soporte@ruedatec.com" className="privacy-link">
                soporte@ruedatec.com
              </a>
              .
            </p>
            <p style={{ marginTop: "10px" }}>
              If you have general inquiries about our service, you can reach us at{" "}
              <a href="mailto:yo@davidmtz.me" className="privacy-link">
                yo@davidmtz.me
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="privacy-footer">
        <p>
          By using AI-knows.me, you acknowledge that you have read and understood this Privacy Policy and consent to the
          collection and use of your information as described.
        </p>
        <p className="privacy-date">Last updated: May 20, 2025</p>
      </div>
    </div>
  )
}
export default PrivacyPolicy