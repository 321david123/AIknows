import AuthScreen from "@/components/AuthScreen"

export default function Auth() {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <AuthScreen />
    </main>
  )
}

