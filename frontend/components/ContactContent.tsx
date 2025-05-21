"use client"

import { useState, useEffect } from "react"

export function Contact() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay the animation to ensure it happens after component mount
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`contact-container ${isVisible ? "visible" : ""}`}>
      <style jsx>{`
        .contact-container {
          // width: 100%;
          max-width: 800px;
          margin-top: 3rem;
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

        .contact-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

          

        
        .contact-container::before {
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

        .contact-heading {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .contact-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .contact-subtitle {
          font-size: 1rem;
          color: #9ca3af;
          margin-top: 0.5rem;
        }

        .contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .contact-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          margin-bottom: 1rem;
          background-color: rgba(31, 41, 55, 0.5);
          border-radius: 8px;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .contact-item:hover {
          transform: translateX(5px);
          background-color: rgba(55, 65, 81, 0.5);
        }

        .contact-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          margin-right: 1rem;
          color: #60a5fa;
        }

        .contact-email {
          font-size: 1rem;
          color: #e5e7eb;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-email:hover {
          color: #60a5fa;
        }

        .contact-purpose {
          margin-left: auto;
          font-size: 0.875rem;
          color: #9ca3af;
          padding: 0.25rem 0.75rem;
          background-color: rgba(31, 41, 55, 0.8);
          border-radius: 9999px;
        }

        @media (max-width: 640px) {
          .contact-container {
            padding: 1.5rem;
          }

          .contact-item {
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem;
          }

          .contact-icon {
            margin-bottom: 0.5rem;
            margin-right: 0;
          }

          .contact-purpose {
            margin-left: 0;
            margin-top: 0.5rem;
            align-self: flex-start;
          }
        }
      `}</style>

      <div className="contact-heading">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">Get in touch with our team</p>
      </div>

      <ul className="contact-list">
        <li className="contact-item">
          <div className="contact-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-7.5" />
              <path d="m22 10.5-8.9 5.3a2 2 0 0 1-2.2 0L2 10.5" />
            </svg>
          </div>
          <a href="mailto:yo@davidmtz.me" className="contact-email">
            yo@davidmtz.me
          </a>
          <span className="contact-purpose">General Inquiries</span>
        </li>

        <li className="contact-item">
          <div className="contact-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-7.5" />
              <path d="m22 10.5-8.9 5.3a2 2 0 0 1-2.2 0L2 10.5" />
            </svg>
          </div>
          <a href="mailto:soporte@ruedatec.com" className="contact-email">
            soporte@ruedatec.com
          </a>
          <span className="contact-purpose">Technical Support</span>
        </li>

        <li className="contact-item">
          <div className="contact-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-7.5" />
              <path d="m22 10.5-8.9 5.3a2 2 0 0 1-2.2 0L2 10.5" />
            </svg>
          </div>
          <a href="mailto:davidmrdev@gmail.com" className="contact-email">
            davidmrdev@gmail.com
          </a>
          <span className="contact-purpose">Development</span>
        </li>
      </ul>
    </div>
  )
}
export default Contact