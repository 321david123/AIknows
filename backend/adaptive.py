import random
from ai import analyze_answer

# In-memory state for production use.
# In a real production system, you’d persist this data.
user_state = {
    "tech_interest": 0.0,
    "creativity": 0.0,
    "leadership": 0.0,
    "communication": 0.0,
    "problem_solving": 0.0,
    "innovation": 0.0,
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
    Processes the answer by analyzing its sentiment and content,
    then updates the user's state for various traits.
    """
    analysis = analyze_answer(answer)
    label = analysis["label"]  # e.g., "POSITIVE" or "NEGATIVE"
    score = analysis["score"]

    answer_lower = answer.lower()

    # Update trait values based on keywords and sentiment.
    if "tech" in answer_lower or "code" in answer_lower:
        user_state["tech_interest"] += score
    if "creative" in answer_lower or "design" in answer_lower:
        user_state["creativity"] += score
    if "lead" in answer_lower or "manage" in answer_lower:
        user_state["leadership"] += score
    if "communicate" in answer_lower or "collaborate" in answer_lower:
        user_state["communication"] += score
    if "solve" in answer_lower or "challenge" in answer_lower:
        user_state["problem_solving"] += score
    if "innovate" in answer_lower or "new" in answer_lower:
        user_state["innovation"] += score

    # Additional adjustments based on sentiment:
    if label == "NEGATIVE" and "frustrated" in answer_lower:
        user_state["communication"] += score * 0.5

def get_next_questions():
    """
    Determines follow-up questions based on the user's current state.
    Returns a list of questions.
    """
    # For a more advanced logic, define a significance threshold:
    threshold = 1.0
    significant_traits = [trait for trait, value in user_state.items() if value > threshold]

    questions_to_ask = []

    # If no trait is significant yet, ask a general motivational question.
    if not significant_traits:
        questions_to_ask.append("What motivates you to excel in your career?")
    else:
        # For each significant trait, select a random question from the list.
        for trait in significant_traits:
            available_questions = trait_questions.get(trait, [])
            if available_questions:
                selected_question = random.choice(available_questions)
                questions_to_ask.append(selected_question)

    return questions_to_ask