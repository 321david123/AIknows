# backend/ai.py
from transformers import pipeline

# Load a sentiment analysis model (for example)
sentiment_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

def analyze_answer(answer: str):
    """
    Analyze the sentiment of the answer.
    Returns a dict with label (POSITIVE/NEGATIVE) and score.
    """
    results = sentiment_model(answer)
    return results[0]