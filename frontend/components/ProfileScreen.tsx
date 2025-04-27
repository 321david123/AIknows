"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Download, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfileScreen() {
  const { data: session, status } = useSession();
  const [report, setReport] = useState("");
  const [traits, setTraits] = useState<string[]>([]);
  const [publicData, setPublicData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the personalized profile report from the backend.
  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dummy: "none" }),
        });
        const data = await res.json();
        setReport(data.report);
        if (data.traits) setTraits(data.traits);
        if (data.public_data) setPublicData(data.public_data);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, []);

  if (status === "loading" || loading) {
    return <p>Loading report...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="profile-container"
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <h1 className="profile-title">Your AI tailored Profile</h1>
      
      {/* User Image */}
      {session?.user?.image && (
        <img
          src={session.user.image}
          alt={session.user.name ?? "User"}
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "1rem",
          }}
        />
      )}
      
      {/* Personalized Report Section */}
      <div className="profile-report" style={{ marginBottom: "2rem" }}>
        <h2>Personalized Report</h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          {report}
        </pre>
      </div>


      {publicData && (
        <div style={{ marginBottom: "2rem" }}>
          <h2>Public Info Summary</h2>
          <p>{publicData}</p>
        </div>
      )}



      {/* Profile Actions */}
      <div
        className="profile-actions"
        style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}
      >
        <a
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/download-report`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <button
            className="profile-button primary"
            style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
          >
            <Download /> Download Report
          </button>
        </a>
        <button
          className="profile-button secondary"
          style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
        >
          <Share2 /> Share Profile
        </button>
      </div>

      <Link
        href="/quiz"
        className="retake-link"
        style={{ fontSize: "1rem", color: "#0070f3", textDecoration: "underline" }}
      >
        Retake Quiz
      </Link>
    </motion.div>
  );
}