"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function QuizScreen() {
  // Get session data so we can personalize the first question
  const { data: session, status } = useSession();
  
  // Local state for current question index and user answers
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);

  // When session is ready, update the questions array
  useEffect(() => {
    // Use a default name if session is not available
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

  // Show a loading state until session data and questions are ready
  if (status === "loading" || questions.length === 0) {
    return <p>Loading...</p>;
  }

  // Calculate progress percentage for the progress bar
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Function to handle clicking the Next button
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
      console.log("New question from backend:", data.nextQuestion);
      
      // Replace the next question in the questions array with the new question from the backend
      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        // Ensure that we're within bounds; here we update the question for the next index
        if (currentQuestion + 1 < newQuestions.length) {
          newQuestions[currentQuestion + 1] = data.nextQuestion;
        } else {
          // Optionally, you could append the new question if needed:
          newQuestions.push(data.nextQuestion);
        }
        return newQuestions;
      });
      
      // Move to the next question
      if (currentQuestion < questions.length - 1) {
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
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Display Current Question */}
      <h2 className="quiz-question">{questions[currentQuestion]}</h2>

      {/* Input Field for Answer */}
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

      {/* Next Button or Final Link */}
      <div className={`quiz-button-container ${currentQuestion === questions.length - 1 ? "center" : ""}`}>
        {currentQuestion < questions.length - 1 ? (
          <button className="quiz-button" onClick={handleNext} disabled={!answers[currentQuestion]}>
            Next
          </button>
        ) : (
          <Link href="/profile" className="quiz-button">
            View Your Profile
          </Link>
        )}
      </div>
    </motion.div>
  );
}