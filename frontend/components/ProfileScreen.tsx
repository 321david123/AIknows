"use client";

import { useState, useEffect, useRef } from "react";
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
  const [userName, setUserName] = useState<string>("");

  // State for TRON-style animation progress and line positions
  const [progress, setProgress] = useState(0);
  const [linePositions, setLinePositions] = useState<{ left: string; top: string; animationDelay: string }[]>([]);

  // Prevent double-fetch in React StrictMode
  const didFetchReport = useRef(false);

  // Fetch the personalized profile report from the backend.
  useEffect(() => {
    if (didFetchReport.current) return;
    didFetchReport.current = true;
    localStorage.removeItem("profileImageUrl");
    const storedImageUrl = localStorage.getItem("profileImageUrl");

    async function fetchReport() {
      try {
        // TEMP: Use dummy payload that matches backend format
        // Load actual answers and summary from localStorage
        const storedAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
        const storedSummary = localStorage.getItem("quizSummary") || "";

        // Filter out empty or whitespace-only answers
        const validAnswers = Array.isArray(storedAnswers)
          ? storedAnswers.filter(a => a.answer && a.answer.trim() !== "")
          : [];

        // Determine raw name (persisted or fallback)
        const rawName = localStorage.getItem("quizName") || validAnswers[0].answer;
        // Capitalize each word
        const formattedName: string = rawName
          .split(" ")
          .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(" ");

        if (validAnswers.length === 0) {
          console.error("Invalid or incomplete answers:", storedAnswers);
          setLoading(false);
          return;
        }

        if (typeof storedSummary !== "string" || !storedSummary.trim()) {
          console.error("Invalid or empty summary:", storedSummary);
          setLoading(false);
          return;
        }

        setUserName(formattedName);

        console.log("Sending answers to backend:", validAnswers);
        console.log("Sending summary to backend:", storedSummary);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formattedName,
            summary: storedSummary,
            answers: validAnswers.map(a => `${a.question}: ${a.answer}`)
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

  // Initialize line positions once on mount
  useEffect(() => {
    const totalLines = 23; // max lines (3 + 20)
    const positions = Array.from({ length: totalLines }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
    }));
    setLinePositions(positions);
  }, []);

  // Effect to increase progress over time for TRON animation
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    const numLines = linePositions.length;
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
          background: "radial-gradient(ellipse at center, #111 0%, #000 100%)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* TRON-style animated lines background */}
        <div className="lines-container">
          {linePositions.slice(0, numLines).map((pos, idx) => (
            <div
              key={idx}
              className="glow-line"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: pos.animationDelay,
              }}
            />
          ))}
        </div>

        {/* Static Loading Text */}
        <h2 style={{ color: "white", zIndex: 1, fontSize: "1.8rem" }}>
          Creating your AI Profile...
        </h2>

        {/* CSS Keyframe Animations */}
        <style jsx>{`
          .lines-container {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
          }
          .glow-line {
            position: absolute;
            width: 2px;
            height: 40px;
            background: linear-gradient(to bottom, #00f0ff, transparent);
            animation: moveLine 3s linear infinite;
            opacity: 0;
            animation-timing-function: ease-in-out;
            animation-fill-mode: both;
            box-shadow: 0 0 8px #00f0ff, 0 0 15px #00f0ff;
            border-radius: 1px;
          }
          @keyframes moveLine {
            0% {
              transform: translateY(-40px);
              opacity: 0;
            }
            10% {
              opacity: 0.2;
            }
            20% {
              opacity: 0.8;
            }
            80% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.2;
            }
            100% {
              transform: translateY(200px);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="profile-container"
      style={{
        background: "#f0f2f5",
        padding: "2rem",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Profile Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
          <img
            src={personalityImage || "/placeholder-avatar.png"}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "1.5rem",
            }}
          />
          <h1 style={{ fontSize: "2rem", margin: 0 }}>
            {userName || "Your Name"}
          </h1>
        </div>

        {/* Summary Section */}
        <div style={{
          marginBottom: "2rem",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}>
          <h2>About</h2>
          <p style={{ color: "#666", margin: 0 }}>
            {report || "Your personalized profile summary will appear here."}
          </p>
        </div>

        {traits.length > 0 && (
          <div style={{
            marginBottom: "2rem",
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            <h2>Personality Traits</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {traits.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "#e0f7fa",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    color: "#00796b",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{
          marginBottom: "2rem",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}>
          <h2>Personality Portrait</h2>
          {personalityImage ? (
            <img
              src={personalityImage}
              alt="AI-generated personality"
              style={{
                width: "100%",
                maxWidth: "600px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            />
          ) : (
            <div style={{
              width: "100%",
              maxWidth: "600px",
              height: "300px",
              background: "#eee",
              borderRadius: "12px"
            }} />
          )}
        </div>

        {recommendations.length > 0 && (
          <div style={{
            marginBottom: "2rem",
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            <h2>AI Recommendations</h2>
            <ul>
              {recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {publicData && (
          <div style={{
            marginBottom: "2rem",
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
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
      </div>
    </motion.div>
  );
}