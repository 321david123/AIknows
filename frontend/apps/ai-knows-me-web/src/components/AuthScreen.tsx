"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LinkedinIcon as LinkedIn } from "lucide-react"
import Link from "next/link"

export default function AuthScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-md mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6">Log in to AI-knows.me</h1>
      <Button asChild variant="outline" className="w-full mb-4 bg-white hover:bg-gray-100">
        <Link href="/quiz" className="flex items-center justify-center">
          <LinkedIn className="mr-2 h-4 w-4" /> Log in with LinkedIn
        </Link>
      </Button>
      <p className="text-sm text-muted-foreground mb-4">
        We&apos;ll only access basic profile data for personalized recommendations.
      </p>
      <Link href="/privacy" className="text-sm text-primary hover:underline">
        View our Privacy Policy
      </Link>
    </motion.div>
  )
}

