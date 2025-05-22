"use client";

// User context state for geo/language/hour/fingerprint

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingVideo from "./ui/loadvid";

// Custom typing effect
function TypingEffect({
  text,
  speed = 20,
  onComplete,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let idx = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, idx + 1));
      idx += 1;
      if (idx >= text.length) {
        clearInterval(timer);
        onComplete && onComplete();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <>{displayed}</>;
}

type QuizEntry = {
  question: string;
  answer: string;
  serpResult?: string;
};

enum QuizPhase {
  Name = "Name",
  Greeting = "Greeting",
  Questions = "Questions",
  Done = "Done",
}


export default function QuizScreen() {
  // Always call hooks unconditionally
  const { data: session, status } = useSession();
  const router = useRouter();

  // Phase management
  const [phase, setPhase] = useState<QuizPhase>(QuizPhase.Name);
  // Unified list of question/answer pairs (first is always name, then greeting, then Qs)
  const [qaList, setQaList] = useState<QuizEntry[]>([{ question: "What's your full name?", answer: "" }]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userContext, setUserContext] = useState<{ region?: string; country?: string; language?: string; hour?: number; fingerprint?: string }>({});
  const [knownUser, setKnownUser] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [finalGreetingHTML, setFinalGreetingHTML] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0); // Index in qaList for input

  // User ID from localStorage
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
// Fallback questions for unknown user flow
const fallbackQuestionsList = [
  "What’s your current role or field of work?",
  "What motivates you right now?",
  "What’s one goal you’re chasing this year?",
  "Tell us something most people don’t know about you."
];
  // User context (geo, lang, hour, fingerprint)
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
        // console.log("User context:", { region: geo.region, country: geo.country_name, language, hour, fingerprint });
      } catch (err) {
        // console.warn("Geo/location context unavailable:", err);
      }
    }
    fetchContext();
  }, []);

  // Progress calculation
  const questionsAnswered = qaList.filter((q, i) => i > 1 && i < currentIdx && q.answer.trim()).length;
  const numQuestions = Math.max(0, totalQuestions ?? (qaList.length - 2)); // exclude name/greeting and clamp to 0 minimum
  const progress = numQuestions
    ? (questionsAnswered / numQuestions) * 100
    : 0;

  // Loading state
  if (status === "loading" || !qaList[0]) {
    return <LoadingVideo />;
  }

  // Handle input value for current question
  const inputValue = qaList[currentIdx]?.answer || "";

  // Handler for Next button
  const handleNext = async () => {
    setButtonClicked(true);
    // Name phase
    if (phase === QuizPhase.Name) {
      const name = qaList[0].answer.trim();
      if (!name) {
        alert("Please enter your full name to continue.");
        setButtonClicked(false);
        return;
      }
      // Immediately transition UI to Greeting phase
      setCurrentIdx(1);
      setPhase(QuizPhase.Greeting);
      setTypingDone(false);
      // Prepare provisional greeting while loading
      const firstName = name.split(" ")[0];
      setFinalGreetingHTML(`Hi ${firstName}, loading your profile...`);
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
        if (!res.ok) throw new Error("Failed to fetch identity.");
        const data = await res.json();
        if (data.gpt?.search_summary) {
          localStorage.setItem("quizSearchSummary", data.gpt.search_summary);
        }
        // Now update with real greeting and questions
        const greeting = data.gpt.matched
          ? `Hi <span class="highlight-name">${firstName}</span>, it's nice to have you on our website. Let's get started with a few questions.`
          : `Hi ${firstName}, it's nice to have you on our website. Let's get started with a few questions.`;
        setFinalGreetingHTML(greeting);
        setKnownUser(!!data.gpt.matched);
        setTotalQuestions(data.gpt.number_of_questions ?? null);
        // Compose followups...
        const followups: QuizEntry[] = [];
        if (data.gpt.first_question) followups.push({ question: data.gpt.first_question, answer: "" });
        if (!data.gpt.matched) {
          if (Array.isArray(data.gpt.nextQuestions)) {
            followups.push(...data.gpt.nextQuestions.map((q: string) => ({ question: q, answer: "" })));
          } else {
            for (let i = 1; i < (data.gpt.number_of_questions || 0); i++) {
              followups.push({ question: "Tell us something about yourself.", answer: "" });
            }
          }
        }
        setQaList([
          { question: "What's your full name?", answer: name },
          { question: greeting, answer: "" },
          ...followups,
        ]);
      } catch (err) {
        // eslint-disable-next-line
        console.error("WhoAmI error:", err);
        alert("Something went wrong. Proceeding to questions.");
      } finally {
        setButtonClicked(false);
      }
      return;
    }
    // Greeting phase: skip input, advance to first real question
    if (phase === QuizPhase.Greeting) {
      setPhase(QuizPhase.Questions);
      setCurrentIdx(2);
      setButtonClicked(false);
      return;
    }
    // Questions phase
    if (phase === QuizPhase.Questions) {
      // If not answered, block
      if (!qaList[currentIdx].answer.trim()) {
        setButtonClicked(false);
        return;
      }
      // Known user branch unchanged...
      if (knownUser) {
        try {
          const name = qaList[0].answer;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit-known-answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              user_id: userId,
              answer: qaList[currentIdx].answer,
              question_id: currentIdx + 1,
              last_question: qaList[currentIdx].question,
              history: qaList.slice(2, currentIdx).map(q => q.answer).filter(Boolean),
              search_summary: localStorage.getItem("quizSearchSummary") || "",
            }),
          });
          const data = await res.json();
          // For known users, append next question if provided
          if (data?.nextQuestions && data.nextQuestions.length > 0) {
            setQaList(prev => {
              const updated = [...prev];
              if (!updated.some(q => q.question === data.nextQuestions[0])) {
                updated.push({ question: data.nextQuestions[0], answer: "" });
              }
              return updated;
            });
          }
          // If last question, phase = Done
          if (currentIdx >= (totalQuestions ? totalQuestions + 1 : qaList.length - 1)) {
            if (typeof window !== "undefined") {
              localStorage.setItem("quizAnswers", JSON.stringify(qaList));
              localStorage.setItem("quizSummary", "placeholder-summary");
            }
            setPhase(QuizPhase.Done);
            setButtonClicked(false);
            router.push("/profile");
            return;
          } else {
            setCurrentIdx(currentIdx + 1);
            setButtonClicked(false);
          }
        } catch (err) {
          // eslint-disable-next-line
          console.error("Error submitting answer:", err);
          setButtonClicked(false);
        }
        return;
      } else {
        // Unknown user fallback
        // Only call enhanced-whoami once when arriving at first question slot
        if (currentIdx === 2) {
          const name = qaList[0].answer;
          const greetingEntry = qaList[1];
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enhanced-whoami`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name,
                user_id: userId,
                questions: qaList.slice(2, currentIdx + 1).map(entry => entry.question),
                answers: qaList.slice(2, currentIdx + 1).map(entry => entry.answer),
              }),
            });
            const data = await res.json();
            // If still not matched, use fallback questions list
            if (!data.gpt.matched) {
              const followups = fallbackQuestionsList.map(q => ({ question: q, answer: "" }));
              setQaList([
                { question: "What's your full name?", answer: name },
                greetingEntry,
                ...followups,
              ]);
              setTotalQuestions(followups.length);
              setKnownUser(false);
              setCurrentIdx(2);
              setButtonClicked(false);
              return;
            } else {
              // Matched: use GPT-provided follow-up question
              const followups = [{ question: data.gpt.first_question, answer: "" }];
              setQaList([
                { question: "What's your full name?", answer: name },
                greetingEntry,
                ...followups,
              ]);
              setTotalQuestions(followups.length);
              setKnownUser(true);
              setCurrentIdx(2);
              setButtonClicked(false);
              return;
            }
          } catch (err) {
            console.error("Enhanced whoami error:", err);
          }
        }
        // Subsequent fallback question progression
        if (currentIdx < qaList.length - 1) {
          setCurrentIdx(currentIdx + 1);
        } else {
          setPhase(QuizPhase.Done);
          router.push("/profile");
        }
        setButtonClicked(false);
        return;
      }
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setButtonClicked(false);
    setQaList(prev => {
      const updated = [...prev];
      updated[currentIdx] = { ...updated[currentIdx], answer: e.target.value };
      return updated;
    });
  };

  // Render logic per phase
  let questionContent = null;
  if (phase === QuizPhase.Name) {
    questionContent = (
      <motion.h2
        className="quiz-question"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TypingEffect text="What's your full name?" speed={22} onComplete={() => setTypingDone(true)} />
      </motion.h2>
    );
  } else if (phase === QuizPhase.Greeting) {
    // Strip HTML tags for typing animation and remove accidental "undefined" at end
    let rawGreeting = finalGreetingHTML.replace(/<[^>]+>/g, '');
    // Remove any accidental "undefined" suffix
    rawGreeting = rawGreeting.replace(/undefined$/g, '').trim();
    questionContent = (
      <motion.h2
        className="quiz-question"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TypingEffect text={rawGreeting} speed={22} onComplete={() => setTypingDone(true)} />
      </motion.h2>
    );
  } else if (phase === QuizPhase.Questions && qaList[currentIdx]) {
    questionContent = (
      <motion.h2
        className="quiz-question"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TypingEffect
          text={qaList[currentIdx].question || ""}
          speed={20}
          onComplete={() => setTypingDone(true)}
        />
      </motion.h2>
    );
  }

  // Show input only for Name and Questions phases
  const showInput = (phase === QuizPhase.Name) || (phase === QuizPhase.Questions && qaList[currentIdx]);

  // Button label
  let buttonLabel = "Next";
  if (phase === QuizPhase.Greeting) buttonLabel = "Continue";
  if (phase === QuizPhase.Questions && currentIdx >= (totalQuestions ? totalQuestions + 1 : qaList.length - 1)) buttonLabel = "View Your Profile";

  // Button disabled logic
  let buttonDisabled = false;
  if (phase === QuizPhase.Name && !qaList[0].answer.trim()) buttonDisabled = true;
  if (phase === QuizPhase.Questions && !qaList[currentIdx]?.answer.trim()) buttonDisabled = true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="quiz-screen"
    >
      <div className="progress-bar-label" style={{ marginBottom: "4px", fontSize: "0.85rem", color: "#ccc" }}>
        {questionsAnswered} of {numQuestions || "?"} questions answered
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      {questionContent}
      {showInput && (
        <input
          className="quiz-input"
          value={inputValue}
          onChange={handleInputChange}
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
        <button
          className={`quiz-button ${buttonClicked ? "clicked" : ""}`}
          onClick={handleNext}
          disabled={buttonDisabled}
        >
          <>
            {buttonLabel}
            {buttonClicked && (
              <span className="dots-loader">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
            )}
          </>
        </button>
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