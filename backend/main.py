from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from adaptive import process_answer, get_next_questions, generate_personalized_recommendations, generate_profile_report
from fastapi.middleware.cors import CORSMiddleware
from adaptive import generate_profile_report  # Ensure your report function is imported
from fpdf import FPDF
from io import BytesIO
from starlette.responses import StreamingResponse
from fastapi.responses import StreamingResponse

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
@app.get("/download-report")
async def download_report():
    try:
        report_text = generate_profile_report()
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        # Add each line of the report to the PDF.
        for line in report_text.split("\n"):
            pdf.cell(200, 10, txt=line, ln=True)
        # Generate PDF as a string and encode it.
        pdf_str = pdf.output(dest="S").encode("latin1")
        buffer = BytesIO(pdf_str)
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))