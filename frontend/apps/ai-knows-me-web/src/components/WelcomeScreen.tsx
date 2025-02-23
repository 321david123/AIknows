"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WelcomeScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      <motion.h1
        className="text-5xl font-bold mb-6 text-white"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Welcome to AI-knows.me!
      </motion.h1>
      <motion.p
        className="text-xl mb-6 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Uncover your unique strengths and unlock personalized recommendations tailored just for you.
      </motion.p>
      <motion.p
        className="mb-8 text-white text-opacity-90"
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
        <Button
          asChild
          variant="secondary"
          className="bg-white text-purple-600 hover:bg-white hover:bg-opacity-90 font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <Link href="/auth">Get Started</Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}

