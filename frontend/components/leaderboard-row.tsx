"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type User = {
  id: number
  rank: number
  name: string
  badge: {
    label: string
    color: string
  }
  score: number
}
interface LeaderboardRowProps {
  user: User
  rankIcon?: React.ReactNode
}

export function LeaderboardRow({ user, rankIcon }: LeaderboardRowProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Generate a seed for the avatar based on the name
  const seed = encodeURIComponent(user.name.toLowerCase().replace(/\s+/g, "-"))

  return (
    <motion.div
      className={cn(
        "grid grid-cols-12 gap-4 p-4 transition-colors duration-200",
        isHovered ? "bg-gray-800/50" : "bg-transparent",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Rank */}
      <div className="col-span-1 flex items-center justify-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-lg font-bold text-white">
          {rankIcon || user.rank}
        </div>
      </div>

      {/* Profile */}
      <div className="col-span-7 flex items-center gap-3 md:col-span-5">
        <Avatar className="h-10 w-10 border-2 border-gray-700">
          <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${seed}`} alt={user.name} />
          <AvatarFallback className="bg-gray-800 text-gray-400">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="truncate font-medium text-white">{user.name}</div>
      </div>

      {/* Badge */}
      <div className="col-span-4 flex items-center md:col-span-3">
        <div className={cn("rounded-full bg-gradient-to-r px-3 py-1 text-xs font-medium text-white", user.badge.color)}>
          {user.badge.label}
        </div>
      </div>

      {/* Score */}
      <div className="hidden items-center justify-end md:col-span-3 md:flex">
        <motion.div animate={isHovered ? { scale: 1.1 } : { scale: 1 }} className="text-xl font-bold tabular-nums">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {user.score.toFixed(1)}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
