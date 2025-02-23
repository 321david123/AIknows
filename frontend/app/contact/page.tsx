import ContactContent from "@/components/ContactContent"
import Footer from "@/components/Footer"

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow flex items-center justify-center p-6">
        <ContactContent />
      </main>
      <Footer />
    </div>
  )
}

