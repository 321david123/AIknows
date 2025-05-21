"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Crown, Trophy, Medal } from "lucide-react"
import "./leaderboard.css"

// Define the user type
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

// Expanded sample data for the leaderboard (30 profiles)
const leaderboardData: User[] = [
  {
    id: 1,
    rank: 1,
    name: "Elon Musk",
    badge: { label: "Innovator", color: "badge-blue-purple" },
    score: 98.7,
  },
  {
    id: 2,
    rank: 2,
    name: "Rihanna",
    badge: { label: "Icon", color: "badge-pink-rose" },
    score: 97.3,
  },
  {
    id: 3,
    rank: 3,
    name: "Oprah Winfrey",
    badge: { label: "Legend", color: "badge-amber-yellow" },
    score: 96.8,
  },
  {
    id: 4,
    rank: 4,
    name: "Cristiano Ronaldo",
    badge: { label: "Champion", color: "badge-emerald-green" },
    score: 95.4,
  },
  {
    id: 5,
    rank: 5,
    name: "Taylor Swift",
    badge: { label: "Visionary", color: "badge-violet-purple" },
    score: 94.9,
  },
  {
    id: 6,
    rank: 6,
    name: "LeBron James",
    badge: { label: "Titan", color: "badge-orange-amber" },
    score: 93.5,
  },
  {
    id: 7,
    rank: 7,
    name: "Beyoncé",
    badge: { label: "Luminary", color: "badge-fuchsia-pink" },
    score: 92.8,
  },
  {
    id: 8,
    rank: 8,
    name: "Bill Gates",
    badge: { label: "Pioneer", color: "badge-cyan-teal" },
    score: 91.6,
  },
  {
    id: 9,
    rank: 9,
    name: "Serena Williams",
    badge: { label: "Trailblazer", color: "badge-red-orange" },
    score: 90.3,
  },
  {
    id: 10,
    rank: 10,
    name: "Dwayne Johnson",
    badge: { label: "Powerhouse", color: "badge-blue-indigo" },
    score: 89.7,
  },
  {
    id: 11,
    rank: 11,
    name: "Michelle Obama",
    badge: { label: "Influencer", color: "badge-green-emerald" },
    score: 88.9,
  },
  {
    id: 12,
    rank: 12,
    name: "Jeff Bezos",
    badge: { label: "Mogul", color: "badge-blue-cyan" },
    score: 88.2,
  },
  {
    id: 13,
    rank: 13,
    name: "Lady Gaga",
    badge: { label: "Maverick", color: "badge-pink-purple" },
    score: 87.6,
  },
  {
    id: 14,
    rank: 14,
    name: "Leonardo DiCaprio",
    badge: { label: "Advocate", color: "badge-green-teal" },
    score: 86.9,
  },
  {
    id: 15,
    rank: 15,
    name: "Malala Yousafzai",
    badge: { label: "Catalyst", color: "badge-amber-orange" },
    score: 86.3,
  },
  {
    id: 16,
    rank: 16,
    name: "Lionel Messi",
    badge: { label: "Virtuoso", color: "badge-sky-blue" },
    score: 85.7,
  },
  {
    id: 17,
    rank: 17,
    name: "Greta Thunberg",
    badge: { label: "Activist", color: "badge-emerald-green" },
    score: 85.1,
  },
  {
    id: 18,
    rank: 18,
    name: "Mark Zuckerberg",
    badge: { label: "Architect", color: "badge-blue-indigo" },
    score: 84.5,
  },
  {
    id: 19,
    rank: 19,
    name: "Simone Biles",
    badge: { label: "Prodigy", color: "badge-red-pink" },
    score: 83.9,
  },
  {
    id: 20,
    rank: 20,
    name: "Sundar Pichai",
    badge: { label: "Strategist", color: "badge-cyan-blue" },
    score: 83.2,
  },
  {
    id: 21,
    rank: 21,
    name: "Emma Watson",
    badge: { label: "Ambassador", color: "badge-violet-purple" },
    score: 82.6,
  },
  {
    id: 22,
    rank: 22,
    name: "Satya Nadella",
    badge: { label: "Transformer", color: "badge-blue-sky" },
    score: 82.0,
  },
  {
    id: 23,
    rank: 23,
    name: "Naomi Osaka",
    badge: { label: "Challenger", color: "badge-pink-rose" },
    score: 81.4,
  },
  {
    id: 24,
    rank: 24,
    name: "Tim Cook",
    badge: { label: "Steward", color: "badge-gray-slate" },
    score: 80.8,
  },
  {
    id: 25,
    rank: 25,
    name: "Billie Eilish",
    badge: { label: "Disruptor", color: "badge-green-teal" },
    score: 80.2,
  },
  {
    id: 26,
    rank: 26,
    name: "Lewis Hamilton",
    badge: { label: "Pacesetter", color: "badge-purple-indigo" },
    score: 79.6,
  },
  {
    id: 27,
    rank: 27,
    name: "Kamala Harris",
    badge: { label: "Pathfinder", color: "badge-amber-yellow" },
    score: 79.0,
  },
  {
    id: 28,
    rank: 28,
    name: "Elon Musk",
    badge: { label: "Innovator", color: "badge-blue-purple" },
    score: 78.4,
  },
  {
    id: 29,
    rank: 29,
    name: "Gal Gadot",
    badge: { label: "Inspiration", color: "badge-red-orange" },
    score: 77.8,
  },
  {
    id: 30,
    rank: 30,
    name: "Ryan Reynolds",
    badge: { label: "Entertainer", color: "badge-emerald-green" },
    score: 77.2,
  },
]

// LeaderboardRow component integrated directly in the same file
function LeaderboardRow({ user, rankIcon }: { user: User; rankIcon?: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false)

  // Generate a seed for the avatar based on the name
  const seed = encodeURIComponent(user.name.toLowerCase().replace(/\s+/g, "-"))

  return (
    <motion.div
      className={`leaderboard-row ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Rank */}
      <div className="rank-column">
        <div className="rank-circle">{rankIcon || user.rank}</div>
      </div>

      {/* Profile */}
      <div className="profile-column">
        <div className="avatar">
          <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${seed}`} alt={user.name} />
        </div>
        <div className="profile-name">{user.name}</div>
      </div>

      {/* Badge */}
      <div className="badge-column">
        <div className={`badge ${user.badge.color}`}>{user.badge.label}</div>
      </div>

      {/* Score */}
      <div className="score-column">
        <motion.div animate={isHovered ? { scale: 1.1 } : { scale: 1 }} className="score">
          {user.score.toFixed(1)}
        </motion.div>
      </div>
    </motion.div>
  )
}

export function Leaderboard() {
  const [users, setUsers] = useState<User[]>([])

  // Simulate loading data with a delay for animation purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(leaderboardData)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Get the rank icon based on position
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="crown-icon" />
      case 2:
        return <Trophy className="trophy-icon" />
      case 3:
        return <Medal className="medal-icon" />
      default:
        return null
    }
  }

  return (
    <div className="leaderboard-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="leaderboard-header"
      >
        <h1 className="title">
          <span className="gradient-text">Leaderboard
          </span>
        </h1>
        {/* <h2 className="subtitle">Hall of Fame</h2> */}
        <p className="description">Top profiles ranked by AI/Human analysis</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="leaderboard-table"
      >
        {/* Glow effect */}
        <div className="glow-effect"></div>

        {/* Header */}
        <div className="table-header">
          <div className="rank-column">#</div>
          <div className="profile-column">Profile</div>
          <div className="badge-column">Badge</div>
          <div className="score-column">Score</div>
        </div>

        {/* Scrollable container for rows */}
        <div className="table-body">
          {/* Rows */}
          <div className="table-rows">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: Math.min(0.1 * index, 1.5) }}
              >
                <LeaderboardRow user={user} rankIcon={getRankIcon(user.rank)} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="leaderboard-footer"
      >
        Profiles analyzed and ranked by AI-Knows.Me advanced algorithms
      </motion.div>
    </div>
  )
}
export default Leaderboard