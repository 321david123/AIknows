from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from adaptive import process_answer, get_next_questions, generate_personalized_recommendations, generate_profile_report
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, set this to your frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnswerPayload(BaseModel):
    answer: str
    question_id: int

@app.post("/submit-answer")
async def submit_answer(payload: AnswerPayload):
    try:
        process_answer(payload.question_id, payload.answer)
        next_questions = get_next_questions()
        if not next_questions:
            next_questions = ["What motivates you to excel in your career?"]
        return {"nextQuestions": next_questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ReportRequest(BaseModel):
    dummy: str = "none"

@app.post("/generate-report")
async def generate_report_endpoint(payload: ReportRequest):
    try:
        # You can combine both a text report and recommendations here if you like.
        report_text = generate_profile_report()
        recommendations = generate_personalized_recommendations()
        return {"report": report_text, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))