"use client";

// User context state for geo/language/hour/fingerprint

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingVideo from "./ui/loadvid";

type QuizEntry = {
  question: string;
  answer: string;
  serpResult?: string;
};

export default function QuizScreen() {
  // Always call hooks unconditionally
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [quizData, setQuizData] = useState<QuizEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [typedGreeting, setTypedGreeting] = useState("");
  const [typedIntro, setTypedIntro] = useState("");
  const [finalGreetingHTML, setFinalGreetingHTML] = useState("");
  const [startGreeting, setStartGreeting] = useState(false);
  const [knownUser, setKnownUser] = useState(false);

  // Button click state for feedback
  const [buttonClicked, setButtonClicked] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [userContext, setUserContext] = useState<{ region?: string; country?: string; language?: string; hour?: number; fingerprint?: string }>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_id");
      if (stored) {
        setUserId(stored);
      } else {
        const id = crypto.randomUUID();
        localStorage.setItem("user_id", id);
        setUserId(id);
      }
    }
  }, []);

  useEffect(() => {
    setQuestions([
      "What's your full name?",
    ]);
    setTypedIntro(""); // ensure intro is reset
  }, []);

  useEffect(() => {
    if (currentQuestion === 0 && questions[0]) {
      setTypedIntro(""); // reset before interval starts
      const fullText = questions[0];
      const interval = setInterval(() => {
        setTypedIntro((prev) => prev + (fullText[prev.length] || ""));
        if (typedIntro.length >= fullText.length - 1) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [currentQuestion, questions]);

  useEffect(() => {
    if (currentQuestion === 1 && questions[1] && startGreeting) {
      setTypedGreeting("");
      const fullText = questions[1];
      const interval = setInterval(() => {
        setTypedGreeting((prev) => prev + (fullText[prev.length] || ""));
        if (typedGreeting.length >= fullText.length - 1) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [currentQuestion, questions, startGreeting]);

  // Collect basic user context: region, country, language, hour, fingerprint
  useEffect(() => {
    async function fetchContext() {
      try {
        const geo = await fetch("https://ipapi.co/json/").then(res => res.json());
        const language = navigator.language || "en-US";
        const hour = new Date().getHours();
        let fingerprint = localStorage.getItem("fingerprint_id");
        if (!fingerprint) {
          fingerprint = crypto.randomUUID();
          localStorage.setItem("fingerprint_id", fingerprint);
        }
        setUserContext({
          region: geo.region,
          language,
          hour,
          fingerprint,
        });
        console.log("User context:", {
          region: geo.region,
          country: geo.country_name,
          language,
          hour,
          fingerprint,
        });
      } catch (err) {
        console.warn("Geo/location context unavailable:", err);
      }
    }
    fetchContext();
  }, []);

  if (status === "loading" || questions.length === 0) {
    return <LoadingVideo />;
  }
  const progress = totalQuestions
    ? ((Math.max(currentQuestion - 2, 0) + 1) / totalQuestions) * 100
    : ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = async () => {
    const answerToSend = answers[currentQuestion];
    if (currentQuestion === 0) {
      const name = answerToSend.trim();
      if (!name) {
        alert("Please enter your full name to continue.");
        return;
      }
      // Store the name as the first answer
      setAnswers((prev) => {
        const updated = [...prev];
        updated[0] = name;
        return updated;
      });
      setButtonClicked(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whoami`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            user_id: userId,
            context: userContext,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch identity. Please try again later.");
        }

        const data = await res.json();
        const intro = `Hi ${name}, let's get to know you better.`;

        const firstName = name.split(" ")[0];
        const greeting = data.gpt.matched
          ? `Hi <span class="highlight-name">${firstName}</span>, it's nice to have you in our website. Let's get started with a few questions.`
          : `Hi ${firstName}, it's nice to have you in our website. Let's get started with a few questions.`;

        setFinalGreetingHTML(greeting);
        setTypedGreeting("");
        const plainGreeting = greeting.replace(/<[^>]+>/g, "");

        if (data?.gpt?.number_of_questions) {
          setTotalQuestions(data.gpt.number_of_questions + 1); // +1 to include name, second entry is not a real question
        }

        setKnownUser(!!data.gpt.matched);

      if (data?.gpt?.matched) {
        const followups = Array(data.gpt.number_of_questions).fill(null).map((_, i) => `Question ${i + 1}`);
        const allQuestions = [
          "What's your full name?",
          plainGreeting,
          data.gpt.first_question,
          ...followups.slice(1),
        ];
        setQuestions(allQuestions);
        setQuizData(allQuestions.map((q) => ({ question: q, answer: "" })));
        // Record the user's name as the first quizData entry
        setQuizData((prev) => {
          const updated = [...prev];
          if (updated[0]) {
            updated[0] = { ...updated[0], answer: name };
          }
          return updated;
        });
      } else {
        const followups = Array(data.gpt.number_of_questions).fill(null).map((_, i) => `Question ${i + 1}`);
        const allQuestions = [
          "What's your full name?",
          intro,
          data.gpt.first_question,
          "We couldn't find you online. Let's create a profile from scratch.",
          ...followups,
        ];
        setQuestions(allQuestions);
        setQuizData(allQuestions.map((q) => ({ question: q, answer: "" })));
        // Record the user's name as the first quizData entry
        setQuizData((prev) => {
          const updated = [...prev];
          if (updated[0]) {
            updated[0] = { ...updated[0], answer: name };
          }
          return updated;
        });
      }

        setCurrentQuestion(1);
        setStartGreeting(true);
      } catch (err) {
        console.error("WhoAmI error:", err);
        alert("Something went wrong trying to fetch your info. Try again later.");
      }
      return;
    }

    try {
      // Skip backend call for intro or summary questions (e.g., question 1 or 2 after name)
      if (currentQuestion > 1) {
        console.log("Submitting answer for question:", questions[currentQuestion]);
        setButtonClicked(true);
        const endpoint = knownUser ? "/submit-known-answer" : "/submit-answer";
        // Use persisted name if available
        const storedName = localStorage.getItem("quizName") || answers[0];
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answer: answerToSend,
            question_id: currentQuestion + 1,
            user_id: userId,
            name: storedName,
            history: quizData.map((q) => q.answer).filter(Boolean),
            last_question: questions[currentQuestion],
          }),
        });
        const data = await res.json();
        console.log("Response from backend:", data);

        // Existing logic for adding nextQuestions (may be for unknown users)
        if (data.nextQuestions && data.nextQuestions.length > 0) {
          setQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            if (currentQuestion + 1 < newQuestions.length) {
              if (!newQuestions.includes(data.nextQuestions[0])) {
                newQuestions[currentQuestion + 1] = data.nextQuestions[0];
              } else {
                newQuestions[currentQuestion + 1] = "asdasdasdCan you share another insight about your work experience?";
              }
            } else {
              newQuestions.push(data.nextQuestions[0]);
            }
            return newQuestions;
          });
        } else {
          console.warn("No new questions returned from backend.");
        }

        // --- Insert GPT follow-up question logic for known users after answering first GPT-based question ---
        // This logic is applied after questions are populated for known users
        if (data.nextQuestions && data.nextQuestions.length > 0) {
          setQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            if (currentQuestion + 1 < newQuestions.length) {
              newQuestions[currentQuestion + 1] = data.nextQuestions[0];
            } else {
              newQuestions.push(data.nextQuestions[0]);
            }
            return newQuestions;
          });
        }
        // --- End GPT follow-up logic ---
      }

      // If it's the last question, save answers and navigate to the profile screen
      if (currentQuestion >= questions.length - 1) {
        if (typeof window !== "undefined") {
          localStorage.setItem("quizAnswers", JSON.stringify(quizData));
          localStorage.setItem("quizSummary", "placeholder-summary");
        }
        router.push("/profile");
        return;
      } else {
        // Update quizData with answer
        setQuizData((prev) => {
          const updated = [...prev];
          updated[currentQuestion] = {
            ...updated[currentQuestion],
            answer: answerToSend,
          };
          console.log("Stored question/answer pair:", updated[currentQuestion]);
          return updated;
        });

        // Determine if user is not well-known (i.e., not matched)
        const knownStatus = quizData[1]?.question && !quizData[1]?.question.toLowerCase().includes("couldn't find you online");
        if (knownStatus === false) {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enhanced-whoami`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: answers[0], // Full name
                answers: answers.slice(0, 5), // First 5 answers to enrich the search
                summary: "",
                traits: [],
                public_data: {}
              }),
            });
            const enhancedData = await res.json();
            console.log("Enhanced GPT summary:", enhancedData.summary);
            // Optionally store in state if needed
          } catch (err) {
            console.warn("Enhanced WhoAmI lookup failed", err);
          }
        }

        // Reset the answer for the current question right after advancing
        setCurrentQuestion(currentQuestion + 1);
        setAnswers((prev) => {
          const newAnswers = [...prev];
          newAnswers[currentQuestion] = "";
          return newAnswers;
        });
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
      <div className="progress-bar-label" style={{ marginBottom: "4px", fontSize: "0.85rem", color: "#ccc" }}>
        {Math.max(currentQuestion - 2, 0) + 1} of {(currentQuestion <= 1 && (!totalQuestions || totalQuestions === 1)) ? "?" : totalQuestions || questions.length} questions answered
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      {currentQuestion === 0 ? (
        <motion.h2
          className="quiz-question"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {typedIntro}
        </motion.h2>
      ) : currentQuestion === 1 ? (
        typedGreeting.length < questions[1].length ? (
          <motion.h2
            className="quiz-question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {typedGreeting}
          </motion.h2>
        ) : (
          <motion.h2
            className="quiz-question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            dangerouslySetInnerHTML={{ __html: finalGreetingHTML }}
          />
        )
      ) : (
        <h2
          className="quiz-question"
          dangerouslySetInnerHTML={{ __html: questions[currentQuestion].replace(/\n/g, "<br />") }}
        />
      )}
      {currentQuestion !== 1 && (
        <input
          className="quiz-input"
          value={answers[currentQuestion] || ""}
          onChange={(e) => {
            setButtonClicked(false);
            const newAnswers = [...answers];
            newAnswers[currentQuestion] = e.target.value;
            setAnswers(newAnswers);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleNext();
            }
          }}
          placeholder="Type your answer here..."
          autoFocus
          autoComplete="off"  
        />
      )}
      
      <div className="quiz-button-container">
        {currentQuestion < questions.length - 1 ? (
          <button
            className={`quiz-button ${buttonClicked ? "clicked" : ""}`}
            onClick={handleNext}
            disabled={currentQuestion !== 1 && !answers[currentQuestion]}
          >
            <>
              Next{buttonClicked && currentQuestion !== 1 && answers[currentQuestion] && (
                <span className="dots-loader">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </span>
              )}
            </>
          </button>
        ) : (
          <button
            className={`quiz-button ${buttonClicked ? "clicked" : ""}`}
            onClick={handleNext}
            disabled={currentQuestion !== 1 && !answers[currentQuestion]}
          >
            {currentQuestion === 0 ? (
              <>
                {!buttonClicked && "Continue"}
                {buttonClicked && (
                  <span className="dots-loader">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </span>
                )}
              </>
            ) : (
              <Link href="/profile" className="Link">View Your Profile</Link>
            )}
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
      <style jsx>{`
        .highlight-name {
          color: gold;
          font-weight: bold;
          animation: pulse 1.5s infinite;
        }

        /* .clicked now reflects a confirmed/submitted state */

        .dots-loader {
          display: inline-flex;
          gap: 3px;
          margin-left: 8px;
        }

        .dot {
          width: 5px;
          height: 5px;
          background-color: #fff;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        .dot:nth-child(3) { animation-delay: 0; }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 40% {
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0% { text-shadow: 0 0 5px gold; }
          50% { text-shadow: 0 0 15px gold; }
          100% { text-shadow: 0 0 5px gold; }
        }

        .progress-bar-label {
          text-align: center;
          font-weight: 500;
        }
      `}</style>
    </motion.div>
  );
}