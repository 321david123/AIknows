import TermsContent from "@/components/TermsContent"
import Footer from "@/components/Footer"

export default function Terms() {
  return (
<div
  className="flex flex-col min-h-screen bg-white"
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
      <main
        className="flex-grow flex items-center justify-center p-6"
        style={{
          // width: "100%",
          maxWidth: "800px",
          marginTop: "3rem",
          marginBottom: "3rem",
          padding: "2rem",
          borderRadius: "12px",
          backgroundColor: "rgba(17, 24, 39, 0.5)",
          backdropFilter: "blur(10px)",
          border: "1px solid #1f2937",
          position: "relative",
          // opacity: 0,
          transform: "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease"
        }}
      >
        <TermsContent />
      </main>
      <Footer />
    </div>
  )
}

