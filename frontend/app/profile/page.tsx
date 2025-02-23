import ProfileScreen from "@/components/ProfileScreen"
import Footer from "@/components/Footer"

export default function Profile() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <main style={{ flex: 1 }}>
        <ProfileScreen />
      </main>
      <Footer />
    </div>
  )
}

