"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function QuizScreen() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    const name = session?.user?.name || "there";
    setQuestions([
      `Hi ${name}, what is the biggest project you've ever worked on?`,
      "What's your favorite way to spend a weekend?",
      "If you could master any skill instantly, what would it be?",
      "What's the most interesting place you've ever visited?",
      "If you could start any business, what would it be?",
      "What's your ideal work environment?",
    ]);
  }, [session]);

  if (status === "loading" || questions.length === 0) {
    return <p>Loading...</p>;
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

      // If the new question is already present, pick a fallback.
      if (questions.includes(newQuestion)) {
        console.warn("New question is repeated, using fallback.");
        newQuestion = "Can you share another insight about your work experience?";
      }

      // If not the last question, update the next question slot.
      if (currentQuestion < questions.length - 1) {
        setQuestions((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[currentQuestion + 1] = newQuestion;
          return updatedQuestions;
        });
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // If it's the last question, process the final answer and redirect.
        router.push("/profile");
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