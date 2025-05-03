"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Download, Share2 } from "lucide-react";

export default function ProfileScreen() {
  const [report, setReport] = useState("");
  const [traits, setTraits] = useState<string[]>([]);
  const [publicData, setPublicData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [personalityImage, setPersonalityImage] = useState<string | null>(null);

  // Fetch the personalized profile report from the backend.
  useEffect(() => {
    localStorage.removeItem("profileImageUrl");
    const storedImageUrl = localStorage.getItem("profileImageUrl");

    async function fetchReport() {
      try {
        // TEMP: Use dummy payload that matches backend format
        const storedAnswers = [
          { question: "What’s your full name?", answer: "John Doe" },
          { question: "What drives you?", answer: "Helping people through technology." },
          { question: "What excites you most about the future?", answer: "The potential of AI in medicine." }
        ];
        const storedSummary =
          "John is a driven individual passionate about leveraging technology to improve lives, especially through AI in healthcare.";

        if (!Array.isArray(storedAnswers)) {
          console.error("storedAnswers is not an array:", storedAnswers);
          setLoading(false);
          return;
        }

        if (storedAnswers.length === 0 || storedAnswers.some(a => typeof a !== 'object' || !a.question || !a.answer)) {
          console.error("Invalid or incomplete answers:", storedAnswers);
          setLoading(false);
          return;
        }

        if (typeof storedSummary !== "string" || !storedSummary.trim()) {
          console.error("Invalid or empty summary:", storedSummary);
          setLoading(false);
          return;
        }

        console.log("Sending answers to backend:", storedAnswers);
        console.log("Sending summary to backend:", storedSummary);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "John Doe",
            summary: storedSummary,
            answers: storedAnswers.map(a => `${a.question}: ${a.answer}`)
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Report generation failed:", res.status, res.statusText, errorData);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setReport(data.report);
        if (data.traits) setTraits(data.traits);
        if (data.public_data) setPublicData(data.public_data);
        if (data.recommendations) setRecommendations(data.recommendations);
        setPersonalityImage(data.image_url || storedImageUrl);
        if (data.image_url) {
          localStorage.setItem("profileImageUrl", data.image_url);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, []);

  if (loading) {
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

      {personalityImage && (
        <div style={{ marginBottom: "2rem" }}>
          <h2>Personality Portrait</h2>
          <img src={personalityImage} alt="AI-generated personality" style={{ width: "300px", borderRadius: "12px" }} />
        </div>
      )}

      {recommendations.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h2>AI Recommendations</h2>
          <ul>
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

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