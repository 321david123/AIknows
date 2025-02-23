"use client";


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingVideo from "./ui/loadvid";

// Function to get a random light background color.
function getRandomLightColor() {
  const lightColors = ["#f9f9f9", "#f7f7f7", "#f5f5f5", "#f3f3f3", "#f1f1f1"];
  return lightColors[Math.floor(Math.random() * lightColors.length)];
}

export default function QuizScreen() {
  // Always call hooks unconditionally
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  // const [background, setBackground] = useState(getRandomLightColor());
  useEffect(() => {
    const name = session?.user?.name || "there";
    setQuestions([
      `Hi ${name}, what is the biggest project you've ever worked on?`,
      "What's your favorite way to spend a weekend?",
      "If you could master any skill instantly, what would it be?",
      "What's the most interesting place you've ever visited?",
      "If you could start any business, what would it be?",
      "What's your ideal work environment?",
      "What motivates you to go the extra mile at work?",
      "How do you overcome challenges when things don't go as planned?",
    ]);
  }, [session]);

  if (status === "loading" || questions.length === 0) {
    return <LoadingVideo />;
  }
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = async () => {
    const answerToSend = answers[currentQuestion];
    try {
      const res = await fetch("http://localhost:8000/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: answerToSend,
          question_id: currentQuestion + 1,
        }),
      });
      const data = await res.json();
      console.log("Response from backend:", data);

      // Assume backend returns an array in data.nextQuestions.
      let newQuestion = data.nextQuestions[0];

      // Update the next question slot with the backend's response if available.
      if (data.nextQuestions && data.nextQuestions.length > 0) {
        setQuestions((prevQuestions) => {
          const newQuestions = [...prevQuestions];
          // Replace the question at the next index
          if (currentQuestion + 1 < newQuestions.length) {
            // Avoid repeating questions.
            if (!newQuestions.includes(data.nextQuestions[0])) {
              newQuestions[currentQuestion + 1] = data.nextQuestions[0];
            } else {
              // Fallback if repeated:
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

      // If it's the last question, process and then redirect to the profile.
      if (currentQuestion >= questions.length - 1) {
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
        placeholder="Your answer..."
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
    </motion.div>
  );
}