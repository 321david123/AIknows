import TermsContent from "@/components/TermsContent"
import Footer from "@/components/Footer"

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow flex items-center justify-center p-6">
        <TermsContent />
      </main>
      <Footer />
    </div>
  )
}

