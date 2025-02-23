"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyContent() {
  const privacyGuidelines = [
    {
      title: "Data Collection",
      content:
        "We collect only the information necessary to provide you with personalized recommendations. This includes your responses to our questionnaire and basic profile information from LinkedIn if you choose to connect your account.",
    },
    {
      title: "Data Usage",
      content:
        "Your data is used solely for generating personalized recommendations and improving our service. We do not sell or share your personal information with third parties.",
    },
    {
      title: "Data Security",
      content:
        "We employ industry-standard security measures to protect your data from unauthorized access, alteration, or destruction.",
    },
    {
      title: "LinkedIn Integration",
      content:
        "If you choose to connect your LinkedIn account, we only access the basic profile information necessary for our service. We do not post on your behalf or access your connections.",
    },
    {
      title: "Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information at any time. You can also request a copy of all the data we hold about you.",
    },
    {
      title: "Cookies",
      content:
        "We use cookies to enhance your experience on our site. You can choose to disable cookies in your browser settings, but this may affect some functionality of our service.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="privacy-container"
    >
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="privacy-description">
        At AI-knows.me, we take your privacy seriously. Here are our key privacy guidelines:
      </p>
      <div className="privacy-grid">
        {privacyGuidelines.map((guideline, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{guideline.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{guideline.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="privacy-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        For more detailed information about our privacy practices, please contact our privacy team.
      </motion.p>
      <style jsx>{`
        .privacy-container {
          max-width: 64rem; /* 1024px */
          margin: 0 auto;
          padding: 2rem;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        .privacy-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 2rem;
          text-align: center;
        }
        .privacy-description {
          font-size: 1.125rem;
          margin-bottom: 2rem;
          text-align: center;
          color: #4a5568;
        }
        .privacy-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .privacy-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .privacy-footer {
          margin-top: 2rem;
          text-align: center;
          color: #718096;
        }
      `}</style>
    </motion.div>
  );
}