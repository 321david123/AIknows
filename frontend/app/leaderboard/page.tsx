import LeaderboardComponent from "@/components/Leaderboard"
import Footer from "@/components/Footer"

export default function Leaderboard() {
  return (
    <div
      style={{
        // minHeight: "100vh",
        // display: "flex",
        // flexDirection: "column",
        // backgroundColor: "#fff",
      }}
    >
      <main style={{ flex: 1 }}>
        <LeaderboardComponent />
      </main>
      <Footer></Footer>
    </div>
  )
}

