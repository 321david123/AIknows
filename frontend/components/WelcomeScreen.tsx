"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function WelcomeScreen() {
  return (
    <main className="welcome-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <motion.h1 initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          Welcome to AI-knows.me!
        </motion.h1>
        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Uncover your unique strengths and unlock personalized recommendations tailored just for you.
        </motion.p>
        <motion.p
          className="description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Our interactive journey will ask adaptive questions and integrate with LinkedIn for professional insights.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link href="/auth" className="button">
            Get Started
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}

