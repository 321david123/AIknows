"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingVideo from "./ui/loadvid";

export default function QuizScreen() {
  // Always call hooks unconditionally
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);

  const [userId] = useState(() => {
    const stored = localStorage.getItem("user_id");
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem("user_id", id);
    return id;
  });

  useEffect(() => {
    setQuestions([
      "What's your full name?",
    ]);
  }, []);

  if (status === "loading" || questions.length === 0) {
    return <LoadingVideo />;
  }
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = async () => {
    const answerToSend = answers[currentQuestion];
    if (currentQuestion === 0) {
      const name = answerToSend.trim();
      if (!name) {
        alert("Please enter your full name to continue.");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whoami`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, user_id: userId }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch identity. Please try again later.");
        }

        const data = await res.json();
        const intro = `Hi ${name}, let's get to know you better.`;

        if (data?.gpt?.matched) {
          const dynamicQuestions = data.followup_questions || [];
          setQuestions([
            "What's your full name?",
            `Hi ${name}, let's get to know you better.`,
            `We found you online. Does this sound like you? ${data.gpt.summary}`,
            ...dynamicQuestions,
          ]);
        } else {
          setQuestions([
            "What's your full name?",
            intro,
            "We couldn't find you online. Let's create a profile from scratch.",
          ]);
        }

        setCurrentQuestion(1);
      } catch (err) {
        console.error("WhoAmI error:", err);
        alert("Something went wrong trying to fetch your info. Try again later.");
      }
      return;
    }

    try {
      // Skip backend call for intro or summary questions (e.g., question 1 or 2 after name)
      if (currentQuestion > 1) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit-answer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answer: answerToSend,
            question_id: currentQuestion + 1,
            user_id: userId,
          }),
        });
        const data = await res.json();
        console.log("Response from backend:", data);

        if (data.nextQuestions && data.nextQuestions.length > 0) {
          setQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            if (currentQuestion + 1 < newQuestions.length) {
              if (!newQuestions.includes(data.nextQuestions[0])) {
                newQuestions[currentQuestion + 1] = data.nextQuestions[0];
              } else {
                newQuestions[currentQuestion + 1] =
                  "Can you share another insight about your work experience?";
              }
            } else {
              newQuestions.push(data.nextQuestions[0]);
            }
            return newQuestions;
          });
        } else {
          console.warn("No new questions returned from backend.");
        }
      }

      // If it's the last question, process and then redirect to the profile.
      if (currentQuestion >= questions.length - 1) {
        // Submit profile before navigating
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: session?.user?.name || "Anonymous",
            answers,
            summary: "To be generated",  // Placeholder if no summary is set
            traits: [],
            public_data: {}
          }),
        });
        router.push("/profile");
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="quiz-screen"
    >
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <h2 className="quiz-question">{questions[currentQuestion]}</h2>
      <input
        className="quiz-input"
        value={answers[currentQuestion] || ""}
        onChange={(e) => {
          const newAnswers = [...answers];
          newAnswers[currentQuestion] = e.target.value;
          setAnswers(newAnswers);
        }}
        placeholder="At least 10 words for functional results"
      />
      
      <div className="quiz-button-container">
        {currentQuestion < questions.length - 1 ? (
          <button
            className="quiz-button"
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
          >
            Next
          </button>
        ) : (
                    <button
            className="quiz-button"
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
          >
            <Link href="/profile" className="Link">
            View Your Profile
          </Link>
          </button>
        )}
      </div>
      <div style={{ textAlign: "left", marginRight: "10px", marginTop: "5px" }}>
        <Link href="/profile">
          <span style={{ fontSize: "0.75rem", opacity: 0.6, cursor: "pointer" }}>
            Already got an account?
          </span>
        </Link>
      </div>
    </motion.div>
  );
}