from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fpdf import FPDF
from io import BytesIO
from starlette.responses import StreamingResponse
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from supabase import create_client, Client
import uuid
import os
from openai import OpenAI
import requests
import json

load_dotenv()  # Load environment variables from .env file
app = FastAPI()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    organization=os.getenv("OPENAI_ORG_ID"),  # You need to add this to your .env file
)
SERP_API_KEY = os.getenv("SERP_API_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, set this to your frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global dictionary to store follow-up questions per session or user
user_followup_questions = {}


class AnswerPayload(BaseModel):
    answer: str
    question_id: int
    user_id: str = None  # Assuming we get a user_id or session id to track followups


def process_answer(question_id, answer):
    print(f"Received answer for Q{question_id}: {answer}")


def get_next_questions(user_id=None):
    if user_id and user_id in user_followup_questions:
        return user_followup_questions.pop(user_id)
    return []


def generate_personalized_recommendations():
    return [
        "Try a creative side project",
        "Explore a leadership role",
        "Collaborate with a team",
    ]


def generate_profile_report():
    return "This is your generated profile summary based on your responses."


@app.post("/submit-answer")
async def submit_answer(payload: AnswerPayload):
    try:
        process_answer(payload.question_id, payload.answer)
        next_questions = get_next_questions(payload.user_id)
        if not next_questions:
            next_questions = ["What motivates you to excel in your career?"]

        return {"nextQuestions": next_questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ReportRequest(BaseModel):
    dummy: str = "none"


class ProfilePayload(BaseModel):
    name: str
    answers: list[str]
    summary: str
    traits: list = []
    public_data: dict = {}


@app.post("/generate-report")
async def generate_report_endpoint(payload: ReportRequest):
    try:
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
        for line in report_text.split("\n"):
            pdf.cell(200, 10, txt=line, ln=True)
        pdf_str = pdf.output(dest="S").encode("latin1")
        buffer = BytesIO(pdf_str)
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=report.pdf"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/submit-profile")
async def submit_profile(payload: ProfilePayload):
    try:
        profile_id = str(uuid.uuid4())
        profile_data = {
            "id": profile_id,
            "name": payload.name,
            "summary": payload.summary,
            "traits": payload.traits,
            "answers": payload.answers,
            "public_data": payload.public_data,
        }
        supabase.table("profiles").insert(profile_data).execute()
        return {"message": "Profile saved successfully", "id": profile_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class WhoAmIRequest(BaseModel):
    name: str
    user_id: str = None  # To associate follow-up questions with user/session


def is_well_known(summary: str) -> bool:
    summary_lower = summary.lower()
    return any(
        keyword in summary_lower
        for keyword in [
            "known",
            "famous",
            "entrepreneur",
            "celebrity",
            "figure",
            "publicly",
            "widely",
        ]
    )


@app.post("/whoami")
async def who_am_i(payload: WhoAmIRequest):
    try:
        serp_url = (
            f"https://serpapi.com/search.json?q={payload.name}&api_key={SERP_API_KEY}"
        )
        serp_response = requests.get(serp_url)
        serp_response.raise_for_status()  # Raises error for non-2xx responses
        results = serp_response.json()
        print("Raw SerpAPI response parsed.")

        organic_results = results.get("organic_results")
        if not organic_results:
            raise ValueError("No organic_results found in SerpAPI response")

        snippets = []
        for result in organic_results[:5]:
            title = result.get("title", "")
            snippet = result.get("snippet", "")
            snippets.append(f"{title}: {snippet}")

        search_summary = "\n".join(snippets)
        print("Search Summary:", search_summary)
        gpt_prompt = f"Based on this search information, does this describe a well-known person named '{payload.name}'? Give a short summary:\n{search_summary}"
        gpt_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": gpt_prompt}],
            temperature=0.6,
        )
        summary = gpt_response.choices[0].message.content
        print("GPT Summary:", summary)

        gpt_followup_prompt = f"""
  Based on this summary: "{summary}", determine:
  1. If this person is well known.
  2. How many follow-up questions are needed (between 2 and 7).
  3. Provide only the first question to ask them.

  Return in this exact JSON format:
  {{
    "matched": true or false,
    "number_of_questions": X,
    "first_question": "..."
  }}
  """

        followup_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": gpt_followup_prompt}],
            temperature=0.7,
        )
        followup_data_raw = followup_response.choices[0].message.content
        print("Follow-up GPT raw:", followup_data_raw)

        try:
            followup_data = json.loads(followup_data_raw)
            print("Parsed follow-up JSON:", followup_data)
        except json.JSONDecodeError as parse_err:
            print("Failed to parse GPT response:", parse_err)
            raise HTTPException(
                status_code=500, detail="Failed to parse GPT follow-up response"
            )

        if payload.user_id:
            user_followup_questions[payload.user_id] = {
                "remaining": followup_data["number_of_questions"] - 1,
                "total": followup_data["number_of_questions"],
            }

        return {
            "searchResults": organic_results,
            "gpt": {
                "matched": followup_data["matched"],
                "summary": summary,
                "number_of_questions": followup_data["number_of_questions"],
                "first_question": followup_data["first_question"],
            },
        }
    except Exception as e:
        print("Error in /whoami:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
