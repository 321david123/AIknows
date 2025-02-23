import Link from "next/link"

export default function WelcomeFooter() {
  return (
    <footer className="welcome-footer">
      <div>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
        <Link href="/contact">Contact Us</Link>
      </div>
      <div>© {new Date().getFullYear()} AI-knows.me. All rights reserved.</div>
    </footer>
  )
}

