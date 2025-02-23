import random
from ai import analyze_answer

# In-memory state for production use.
# In a real production system, you’d persist this per user.
user_state = {
    "tech_interest": 0.0,
    "creativity": 0.0,
    "leadership": 0.0,
    "communication": 0.0,
    "problem_solving": 0.0,
    "innovation": 0.0,
}

# Expanded dictionary of keywords for each trait.
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
    Analyzes the answer using sentiment analysis and updates user_state
    based on keywords and sentiment score.
    """
    analysis = analyze_answer(answer)
    label = analysis["label"]  # e.g., "POSITIVE" or "NEGATIVE"
    score = analysis["score"]

    print("Analysis output:", analysis)  # Debug log
    answer_lower = answer.lower()

    # For each trait, update the state if any keyword is found in the answer.
    for trait, word_list in keywords.items():
        if any(word in answer_lower for word in word_list):
            user_state[trait] += score

    # Additional adjustment: boost communication if negative sentiment and "frustrated" is mentioned.
    if label == "NEGATIVE" and "frustrated" in answer_lower:
        user_state["communication"] += score * 0.5

    print("Updated user_state:", user_state)  # Debug log

def get_next_questions():
    """
    Determines follow-up questions based on the user's current state.
    Returns a list of questions based on traits exceeding a threshold.
    """
    threshold = 0.2  # Adjust threshold as needed
    significant_traits = [trait for trait, value in user_state.items() if value > threshold]
    questions_to_ask = []

    if not significant_traits:
        questions_to_ask.append("What motivates you to excel in your career?")
    else:
        for trait in significant_traits:
            available_questions = trait_questions.get(trait, [])
            if available_questions:
                selected_question = random.choice(available_questions)
                questions_to_ask.append(selected_question)

    print("get_next_questions returning:", questions_to_ask)  # Debug log
    return questions_to_ask

def generate_personalized_recommendations():
    """
    Generates dynamic recommendations based on user_state.
    Returns a dictionary with keys: careers, hobbies, cities, startups.
    """
    recommendations = {
        "careers": [],
        "hobbies": [],
        "cities": [],
        "startups": [],
    }

    # Careers recommendations
    if user_state["tech_interest"] > 0.5:
        recommendations["careers"].append(random.choice([
            "Data Scientist", "Machine Learning Engineer", "DevOps Engineer"
        ]))
    if user_state["creativity"] > 0.5:
        recommendations["careers"].append(random.choice([
            "UX Designer", "Creative Director", "Digital Marketer"
        ]))
    if user_state["leadership"] > 0.5:
        recommendations["careers"].append(random.choice([
            "Entrepreneur", "Project Manager", "Team Lead"
        ]))

    # Hobbies recommendations
    if user_state["creativity"] > 0.3:
        recommendations["hobbies"].append(random.choice([
            "Photography", "Painting", "Writing"
        ]))
    if user_state["problem_solving"] > 0.5:
        recommendations["hobbies"].append(random.choice([
            "Rock Climbing", "Chess", "Puzzle Solving"
        ]))
    if user_state["innovation"] > 0.5:
        recommendations["hobbies"].append(random.choice([
            "Cooking", "DIY Projects", "Gardening"
        ]))

    # Cities recommendations (tailored for tech or creative hubs)
    if user_state["tech_interest"] > 0.5:
        recommendations["cities"].append(random.choice([
            "San Francisco", "Seattle", "Bangalore"
        ]))
    if user_state["creativity"] > 0.5:
        recommendations["cities"].append(random.choice([
            "Berlin", "Amsterdam", "Paris"
        ]))

    # Startup ideas (based on innovation and leadership)
    if user_state["innovation"] > 0.5:
        recommendations["startups"].append(random.choice([
            "AI-powered personal assistant", "Sustainable fashion marketplace", "Virtual reality education platform"
        ]))
    if user_state["leadership"] > 0.5:
        recommendations["startups"].append(random.choice([
            "Tech incubator", "Crowdsourced innovation platform", "Leadership training startup"
        ]))

    # Fallback defaults if no recommendations were generated for a category.
    if not recommendations["careers"]:
        recommendations["careers"] = ["Data Scientist", "UX Designer", "Entrepreneur"]
    if not recommendations["hobbies"]:
        recommendations["hobbies"] = ["Photography", "Rock Climbing", "Cooking"]
    if not recommendations["cities"]:
        recommendations["cities"] = ["San Francisco", "Berlin", "Tokyo"]
    if not recommendations["startups"]:
        recommendations["startups"] = [
            "AI-powered personal assistant",
            "Sustainable fashion marketplace",
            "Virtual reality education platform",
        ]

    return recommendations

def generate_profile_report():
    """
    Generates a profile report based on the current user_state and dynamic recommendations.
    """
    recs = generate_personalized_recommendations()
    report_lines = []
    report_lines.append("Based on your responses, here are your personalized insights:")
    report_lines.append("")
    report_lines.append("**Career Recommendations:**")
    report_lines.append(", ".join(recs["careers"]))
    report_lines.append("")
    report_lines.append("**Hobby Suggestions:**")
    report_lines.append(", ".join(recs["hobbies"]))
    report_lines.append("")
    report_lines.append("**Cities to Consider:**")
    report_lines.append(", ".join(recs["cities"]))
    report_lines.append("")
    report_lines.append("**Startup Ideas:**")
    report_lines.append(", ".join(recs["startups"]))
    return "\n".join(report_lines)
