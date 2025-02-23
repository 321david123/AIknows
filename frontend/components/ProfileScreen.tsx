"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Download, Share2 } from "lucide-react"

const recommendations = {
  careers: ["Data Scientist", "UX Designer", "Entrepreneur"],
  hobbies: ["Photography", "Rock Climbing", "Cooking"],
  cities: ["San Francisco", "Berlin", "Tokyo"],
  startups: ["AI-powered personal assistant", "Sustainable fashion marketplace", "Virtual reality education platform"],
}

export default function ProfileScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="profile-container"
    >
      <h1 className="profile-title">Your AI-knows.me Profile</h1>

      <div className="profile-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="profile-card"
        >
          <h2>Careers</h2>
          <ul>
            {recommendations.careers.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="profile-card"
        >
          <h2>Hobbies</h2>
          <ul>
            {recommendations.hobbies.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="profile-card"
        >
          <h2>Cities</h2>
          <ul>
            {recommendations.cities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="profile-card"
        >
          <h2>Startups</h2>
          <ul>
            {recommendations.startups.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="profile-actions">
        <button className="profile-button primary">
          <Download /> Download Report
        </button>
        <button className="profile-button secondary">
          <Share2 /> Share Profile
        </button>
      </div>

      <Link href="/quiz" className="retake-link">
        Retake Quiz
      </Link>
    </motion.div>
  )
}

