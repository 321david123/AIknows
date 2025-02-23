import QuizScreen from "@/components/QuizScreen"
import Footer from "@/components/Footer"

export default function Quiz() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <QuizScreen />
      </main>
      <Footer />
    </div>
  )
}

