"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Download, Share2 } from "lucide-react";
import supabase from "../lib/supabaseClient";

export default function ProfileScreen() {
  const [report, setReport] = useState("");
  const [traits, setTraits] = useState<string[]>([]);
  const [publicData, setPublicData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [personalityImage, setPersonalityImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [badge, setBadge] = useState<string>("");

  const [futureOutcomes, setFutureOutcomes] = useState<string>("");

  const [showBadgeInfo, setShowBadgeInfo] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");

  // New state for secure profile code verification
  const [isSecured, setIsSecured] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // State for TRON-style animation progress and line positions
  const [progress, setProgress] = useState(0);
  const [linePositions, setLinePositions] = useState<{ left: string; top: string; animationDelay: string }[]>([]);

  // Prevent double-fetch in React StrictMode
  const didFetchReport = useRef(false);

  // Fetch the personalized profile report from the backend.
  useEffect(() => {
    if (didFetchReport.current) return;
    didFetchReport.current = true;
    // localStorage.removeItem("profileImageUrl");
    const storedImageUrl = localStorage.getItem("profileImageUrl");
    // Preload image from localStorage before fetching report
    if (storedImageUrl) {
      setPersonalityImage(storedImageUrl);
    }

    async function fetchReport() {
      // Declare these above the try block so they are accessible in finally
      let formattedName: string = "";
      let data: any = {};
      const storedImageUrl = localStorage.getItem("profileImageUrl");
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
        formattedName = rawName
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

        // Retrieve stored SerpAPI/GPT search summary for use in profile generation
        const storedSearchSummary = localStorage.getItem("quizSearchSummary") || "";

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formattedName,
            summary: storedSummary,
            search_summary: storedSearchSummary,
            answers: validAnswers.map(a => `${a.question}: ${a.answer}`)
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Report generation failed:", res.status, res.statusText, errorData);
          setLoading(false);
          return;
        }

        data = await res.json();
        // Store the badge text if provided
        if (data.badge) {
          setBadge(data.badge);
        }
        setReport(data.report);
        if (data.traits) setTraits(data.traits);
        if (data.public_data) setPublicData(data.public_data);
        if (data.recommendations) setRecommendations(data.recommendations);
        // setPersonalityImage(data.image_url || storedImageUrl); // removed as per instructions
        // Store GPT-generated future outcomes if provided
        if (data.future_outcomes) {
          setFutureOutcomes(data.future_outcomes);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setProgress(100); // instantly complete animation
        setLoading(false);
        // 🔄 Generate image after showing profile
        // Only generate/set image if not already cached in localStorage
        const storedImageUrl = localStorage.getItem("profileImageUrl");
        if (!storedImageUrl) {
          try {
            const imageRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-image`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: formattedName,
                traits: data.traits || [],
                summary: data.report || ""
              }),
            });

            if (imageRes.ok) {
              const imageData = await imageRes.json();
              if (imageData.image_url) {
                setPersonalityImage(imageData.image_url);
                localStorage.setItem("profileImageUrl", imageData.image_url);
              }
            } else {
              console.warn("Image generation failed:", await imageRes.text());
            }
          } catch (err) {
            console.error("Error generating image:", err);
          }
        }
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

  // Handler to secure the profile and send verification code email
  const handleSecureProfile = async (email: string, password: string) => {
    if (!email || !password) {
      setServerError("Email and password are required.");
      return;
    }
    setServerError("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/request-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error requesting verification code:", res.statusText, errorData);
        const errMsg =
          errorData.message ||
          errorData.error ||
          errorData.detail ||
          "Failed to send verification code.";
        setServerError(errMsg);
        return;
      }
      setShowCodeModal(true); // Only show code modal on success
    } catch (err) {
      console.error("Verification request error:", err);
      setServerError("Error sending verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to verify confirmation code and send profile to Supabase after successful verification
  const handleVerifyCode = async () => {
    try {
      // Step 1: verify code only
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, code: verificationCode }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Verification failed:", res.statusText, errorData);
        alert("Invalid or expired code.");
        return;
      }

      // Step 2: after successful verification, send profile data to /submit-profile
      try {
        // Load answers, summary, and user name from localStorage
        const storedAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
        const storedSummary = localStorage.getItem("quizSummary") || "";
        const storedSearchSummary = localStorage.getItem("quizSearchSummary") || "";

        const validAnswers = Array.isArray(storedAnswers)
          ? storedAnswers.filter((a: any) => a.answer && a.answer.trim() !== "")
          : [];

        // Derive formattedName from quizName or first quiz answer
        const rawName =
          localStorage.getItem("quizName") ||
          (validAnswers[0]?.answer ? validAnswers[0].answer : "Anonymous");
        const formattedName: string = rawName
          .split(" ")
          .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(" ");

        // Log storedSummary and storedSearchSummary before API call
        console.log("storedSummary:", storedSummary);
        console.log("storedSearchSummary:", storedSearchSummary);

        const submitProfileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput,
            password: passwordInput,
            code: verificationCode,
            name: formattedName,
            summary: storedSummary,
            search_summary: storedSearchSummary,
            answers: validAnswers.map((a: any) => `${a.question}: ${a.answer}`)
          }),
        });

        if (!submitProfileRes.ok) {
          const errorData = await submitProfileRes.json().catch(() => ({}));
          console.error("Error sending profile to Supabase:", submitProfileRes.statusText, errorData);
          alert("Failed to save profile after verification.");
          // Still allow user to continue, but inform about the error
        }
      } catch (profileSendErr) {
        console.error("Error sending profile to Supabase:", profileSendErr);
        alert("Failed to save profile after verification.");
      }

      alert("Email verified! Your profile is now secured.");
      setIsSecured(true);
      setShowCodeModal(false);
    } catch (err) {
      console.error("Error verifying code:", err);
      alert("Verification error.");
    }
  };

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
        background: "#ffffff",
        padding: "2rem",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Profile Header */}
        <div className="profile-header" style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
          <img
            src={personalityImage || "/placeholder-avatar.png"}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "1.5rem",
              filter: !personalityImage ? "blur(8px)" : "none",
              transition: "filter 0.5s ease-in-out",
            }}
          />
          <h1 style={{ fontSize: "2rem", margin: 0 }}>
            {userName || "Your Name"}
          </h1>
          {badge && (
            <div className="badge-container" style={{ position: "relative", display: "inline-block", marginLeft: "1rem" }}>
              <span
                onMouseEnter={() => setShowBadgeInfo(true)}
                onMouseLeave={() => setShowBadgeInfo(false)}
                onClick={() => setShowBadgeInfo(prev => !prev)}
                style={{
                  padding: "0.25rem 0.5rem",
                  background: "gold",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  color: "#000",
                  fontWeight: "600",
                  textShadow: "0 0 6px gold",
                  boxShadow: "0 0 8px gold",
                  animation: "glow 2s ease-in-out infinite alternate",
                  cursor: "pointer"
                }}
              >
                {badge}
              </span>
              {showBadgeInfo && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "#fff",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                    fontSize: "0.75rem",
                    zIndex: 100
                  }}
                >
                  This badge recognizes individuals with exceptional uniqueness and impact.
                </div>
              )}
            </div>
          )}
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
          <h2>Possible Outcomes</h2>
          <p style={{ color: "#666", margin: 0, whiteSpace: "pre-wrap" }}>
            {futureOutcomes || "Your personalized possible outcomes will appear here."}
          </p>
        </div>

        {recommendations.length > 0 && (
          <div style={{
            marginBottom: "2rem",
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            <h2>Recommendations</h2>
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

        {/* Optionally show locked/unlocked state */}
        <div style={{ marginBottom: "1rem", fontWeight: "bold" }}>
          {isSecured ? "🔓 Profile Secured" : "🔒 Profile Not Secured"}
        </div>
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
          {!isSecured && (
            <button
              onClick={() => {
                // Prevent regression to the initial modal if code modal was already shown
                if (!showCodeModal) {
                  setShowCodeModal(false);
                }
                setShowEmailModal(true);
              }}
              className="profile-button primary"
            >
              🔒 Secure Your Profile
            </button>
          )}
          <Link href="/leaderboard" passHref>
            <button
              className="profile-button secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
            >
              🏆 See Leaderboard
            </button>
          </Link>
        </div>

        <Link
          href="/quiz"
          className="retake-link"
          style={{ fontSize: ".8rem", color: "#0070f3", textDecoration: "underline" }}
        >
          Retake Quiz
        </Link>
      </div>
      {showEmailModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={showCodeModal ? "code" : "email"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                color: "#000",
                width: "90%",
                maxWidth: "500px"
              }}
            >
              {!showCodeModal ? (
                <>
                  <h2 style={{ marginBottom: "1rem" }}>Join the Leaderboard</h2>
                  <p style={{ fontSize: "0.9rem", color: "#555" }}>Enter your email to secure your profile and get featured.</p>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      setEmailError("");
                      setPasswordError("");
                      setServerError("");
                      if (!emailInput.includes("@")) {
                        setEmailError("Please enter a valid email address.");
                        return;
                      }
                      if (passwordInput.length < 6) {
                        setPasswordError("Password must be at least 6 characters long.");
                        return;
                      }
                      handleSecureProfile(emailInput, passwordInput);
                    }}
                    style={{ width: "100%" }}
                  >
                    {serverError && (
                      <p style={{ color: "red", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                        {serverError}
                      </p>
                    )}
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        marginTop: "1rem",
                        marginBottom: "0.25rem",
                        border: "1px solid #ccc",
                        borderRadius: "8px"
                      }}
                    />
                    {emailError && (
                      <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                        {emailError}
                      </p>
                    )}
                    <input
                      type="password"
                      placeholder="Create a password"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        marginTop: "0.5rem",
                        marginBottom: "0.25rem",
                        border: "1px solid #ccc",
                        borderRadius: "8px"
                      }}
                    />
                    {passwordError && (
                      <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                        {passwordError}
                      </p>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                      <button
                        type="submit"
                        style={{ padding: "0.5rem 1rem", background: "#0070f3", color: "#fff", border: "none", borderRadius: "6px" }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEmailModal(false)}
                        style={{ padding: "0.5rem 1rem", background: "#ccc", border: "none", borderRadius: "6px" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h2 style={{ marginBottom: "1rem" }}>Provide the code you just received to your email</h2>
                  <input
                    type="text"
                    placeholder="Enter the code from your email"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      marginBottom: "1rem",
                      border: "1px solid #ccc",
                      borderRadius: "8px"
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                      onClick={handleVerifyCode}
                      style={{ padding: "0.5rem 1rem", background: "#0070f3", color: "#fff", border: "none", borderRadius: "6px" }}
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => {
                        setShowEmailModal(false);
                        // Do not reset showCodeModal here to prevent regression to email/password modal
                        // setShowCodeModal(false);
                      }}
                      style={{ padding: "0.5rem 1rem", background: "#ccc", border: "none", borderRadius: "6px" }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      <style jsx>{`
        @keyframes glow {
          0% {
            text-shadow: 0 0 8px gold;
            box-shadow: 0 0 12px gold;
          }
          50% {
            text-shadow: 0 0 20px gold;
            box-shadow: 0 0 28px gold;
          }
          100% {
            text-shadow: 0 0 12px gold;
            box-shadow: 0 0 16px gold;
          }
        }
        @media (max-width: 600px) {
          .profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .profile-header img {
            margin-right: 0 !important;
            margin-bottom: 1rem;
          }
          .profile-header h1 {
            font-size: 1.5rem;
          }
          .badge-container {
            margin-top: 0.5rem !important;
            margin-left: 0 !important;
          }
        }
      `}</style>
      <style jsx global>{`
        html, body {
          background: #f0f2f5 !important;
        }
      `}</style>
    </motion.div>
  );
}