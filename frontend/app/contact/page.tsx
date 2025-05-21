import ContactContent from "@/components/ContactContent"
import Footer from "@/components/Footer"

export default function Contact() {
  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: "#000000",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
    <main
      className="flex-grow flex items-center justify-center p-6"
      style={{
        backgroundColor: "#000000",
        width: "100%",
        maxWidth: "800px",
        // marginTop: "3rem",
        borderRadius: "12px",
        // backgroundColor: "rgba(17, 24, 39, 0.5)",
        // backdropFilter: "blur(10px)",
        // border: "1px solid #1f2937",
        position: "relative",
        // opacity: 0,
        transform: "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        marginBottom: "20%",
      }}
    >
      <ContactContent />
    </main>
      <Footer />
    </div>
  )
}

