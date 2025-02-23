from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from adaptive import process_answer, get_next_questions
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS so your frontend (running on a different port) can access this endpoint.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
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
        # Process the incoming answer with adaptive logic.
        process_answer(payload.question_id, payload.answer)
        # Get a list of follow-up questions based on updated state.
        next_questions = get_next_questions()
        return {"nextQuestions": next_questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))