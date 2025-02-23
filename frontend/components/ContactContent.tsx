"use client";

import { motion } from "framer-motion";

export default function ContactContent() {
  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <h2>Get in Touch</h2>
        <p>
          We'd love to hear from you. Please fill out this form or use our
          contact information below.
        </p>
      </header>
      <div className="contact-grid">
        <div className="card form-card">
          <h2>Get in Touch</h2>
          <form className="contact-form" action="#" method="POST">
            <label htmlFor="name">Your Name</label>
            <input id="name" type="text" placeholder="Your Name" required />

            <label htmlFor="email">Your Email</label>
            <input id="email" type="email" placeholder="Your Email" required />

            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              placeholder="Your Message"
              rows={4}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
        <div className="card info-card">
          <h2>Contact Information</h2>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:davidmrdev@gmail.com">davidmrdev@gmail.com</a>
          </p>
          <p>
            <strong>Support:</strong>{" "}
            <a href="mailto:support@ai-knows.me">support@ai-knows.me</a>
          </p>
          <p>
            <strong>Phone:</strong> +1 (555) 123-4567
          </p>
          <p>
            <strong>Address:</strong> 123 AI Street, Tech City, TC 12345
          </p>
        </div>
      </div>
      {/* <footer className="contact-footer">
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact Us</a>
        </div>
        <p>© 2025 AI-knows.me. All rights reserved.</p>
      </footer> */}

      <style jsx>{`
        .contact-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.6;
        }
        .contact-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .contact-header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        .contact-header h2 {
          font-size: 1.75rem;
          margin-bottom: 10px;
          color: #555;
        }
        .contact-header p {
          font-size: 1rem;
          color: #666;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }
        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .card {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .form-card h2,
        .info-card h2 {
          font-size: 1.5rem;
          margin-bottom: 15px;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
        }
        .contact-form label {
          margin-bottom: 5px;
          font-weight: bold;
        }
        .contact-form input,
        .contact-form textarea {
          margin-bottom: 15px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        .contact-form button {
          padding: 10px;
          font-size: 1rem;
          background: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .contact-form button:hover {
          background: #005bb5;
        }
        .info-card p {
          margin: 10px 0;
        }
        .info-card a {
          color: #0070f3;
          text-decoration: none;
        }
        .info-card a:hover {
          text-decoration: underline;
        }
        .contact-footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 0.875rem;
          color: #777;
        }
        .footer-links {
          margin-bottom: 10px;
        }
        .footer-links a {
          margin: 0 10px;
          color: #0070f3;
          text-decoration: none;
        }
        .footer-links a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}