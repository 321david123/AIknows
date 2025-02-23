import random
from ai import analyze_answer

# In-memory state for production use.
# In a production system, you’d persist this data per user.
user_state = {
    "tech_interest": 0.0,
    "creativity": 0.0,
    "leadership": 0.0,
    "communication": 0.0,
    "problem_solving": 0.0,
    "innovation": 0.0,
}

# Expanded dictionary of keywords for each trait.
# Each trait now includes about 20 keywords for richer detection.
keywords = {
    "tech_interest": [
        "tech", "code", "program", "software", "development",
        "engineer", "technology", "algorithm", "data", "automation",
        "cyber", "computing", "network", "system", "ai",
        "machine", "cloud", "database", "devops", "robotics"
    ],
    "creativity": [
        "creative", "design", "art", "inspire", "imagine",
        "innovation", "original", "vision", "express", "color",
        "abstract", "visual", "novel", "craft", "poetic",
        "concept", "muse", "unique", "imaginative", "artistic"
    ],
    "leadership": [
        "lead", "manage", "director", "coach", "mentor",
        "guide", "inspire", "supervise", "captain", "head",
        "boss", "chief", "strategy", "decision", "authority",
        "command", "initiative", "drive", "responsible", "visionary"
    ],
    "communication": [
        "communicate", "collaborate", "teamwork", "speak", "dialogue",
        "conversation", "explain", "clarify", "articulate", "express",
        "network", "rapport", "interaction", "discuss", "engage",
        "interpersonal", "connect", "mediate", "negotiate", "present"
    ],
    "problem_solving": [
        "solve", "challenge", "problem", "trouble", "fix",
        "issue", "resolve", "overcome", "tackle", "innovate",
        "strategize", "debug", "repair", "adapt", "adjust",
        "improvise", "determine", "analyze", "breakdown", "examine"
    ],
    "innovation": [
        "innovate", "new", "fresh", "disrupt", "transform",
        "modernize", "change", "cutting-edge", "revolution", "forward",
        "pioneer", "trailblaze", "creative", "invent", "improve",
        "evolve", "advance", "breakthrough", "radical", "novel"
    ],
}

# Predefined follow-up questions for each trait.
trait_questions = {
    "tech_interest": [
        "What technical challenge did you overcome in your recent project?",
        "Can you describe a cutting-edge technology you enjoy working with?",
        "How does technology help you solve problems in your work?",
    ],
    "creativity": [
        "What creative solution did you use to solve a problem at work?",
        "How do you foster creativity in your daily tasks?",
        "What is your favorite creative project and why?",
    ],
    "leadership": [
        "How do you motivate your team during challenging times?",
        "What leadership style do you follow and why?",
        "Can you share an experience where you successfully led a project?",
    ],
    "communication": [
        "How do you ensure clear communication in your team?",
        "What strategies do you use for effective collaboration?",
        "Describe a time when your communication skills made a difference.",
    ],
    "problem_solving": [
        "Can you explain a complex problem you solved recently?",
        "What is your approach to tackling unexpected challenges?",
        "How do you prioritize tasks when faced with multiple issues?",
    ],
    "innovation": [
        "What innovative idea have you implemented in your work?",
        "How do you stay ahead of industry trends?",
        "Describe a time when you introduced a new approach that improved results.",
    ],
}

def process_answer(question_id: int, answer: str):
    """
    Analyzes the answer using a sentiment analysis model and updates the user's state
    based on keywords and sentiment score.
    """
    analysis = analyze_answer(answer)
    label = analysis["label"]  # e.g., "POSITIVE" or "NEGATIVE"
    score = analysis["score"]

    print("Analysis output:", analysis)  # Debug logging
    answer_lower = answer.lower()

    # For each trait, if any keyword is found in the answer, update the corresponding state.
    for trait, word_list in keywords.items():
        if any(word in answer_lower for word in word_list):
            user_state[trait] += score

    # Additional adjustment: if the sentiment is negative and "frustrated" is mentioned,
    # boost communication.
    if label == "NEGATIVE" and "frustrated" in answer_lower:
        user_state["communication"] += score * 0.5

    print("Updated user_state:", user_state)  # Debug logging

def get_next_questions():
    """
    Determines follow-up questions based on the user's current state.
    Returns a list of questions.
    """
    # Lower threshold to ensure that even small increments trigger a change.
    threshold = 0.1
    significant_traits = [trait for trait, value in user_state.items() if value > threshold]
    questions_to_ask = []

    if not significant_traits:
        # Fallback: no trait has risen above the threshold.
        questions_to_ask.append("What motivates you to excel in your career?")
    else:
        # For each significant trait, select a random question from that trait's question list.
        for trait in significant_traits:
            available_questions = trait_questions.get(trait, [])
            if available_questions:
                selected_question = random.choice(available_questions)
                questions_to_ask.append(selected_question)

    print("get_next_questions returning:", questions_to_ask)  # Debug logging
    return questions_to_ask