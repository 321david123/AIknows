import { LoginPage } from "@/components/login"
import Footer from "@/components/Footer"
export default function Privacy() {
  return (
<main
  className="flex min-h-screen flex-col items-center justify-between p-24"
  style={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "black",
    padding: "1rem"
  }}
>
    <LoginPage/>
      <Footer/>  
    </main>

  )
}

