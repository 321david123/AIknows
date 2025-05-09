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
    # New fields for more context from frontend
    history: list[str] = []
    last_question: str = ""
    name: str = ""
    search_summary: str = ""


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


def generate_profile_report_with_image(name, answers, summary,search_summary=""):
    prompt = f"""
This is a profile of a person named {name}. Here are their answers:
{answers}

Summary: {summary}

Based on this, write:
1. A short profile summary in third person.
2. Rate the uniqueness and social/technical impact of this person from 1 to 10.
3. If this person is well-recognized (matched=True in previous logic), add the text: "Incredible Individual" as a string in the response.
4. Describe 3 possible outcomes for this person 10 years from now, including where they might be and what could happen with their company (e.g., reaching unicorn status). Return these as a single multi-line string under the field "future_outcomes".
5. Suggest 3 personalized recommendations for this person based on their profile, and return them as a JSON array under the field "recommendations".

Return in this JSON format (including the new fields):
{{
  "summary": "...",
  "uniqueness_score": 9,
  "badge": "Incredible Individual",
  "future_outcomes": "...",
  "recommendations": ["...", "...", "..."]
}}
"""

    print("PROFILE GENERATION PROMPT:", prompt)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    
    try:
        profile_data = json.loads(response.choices[0].message.content)
        print("Parsed Profile Data:", profile_data)
        # Generate DALL·E image using the prompt
        dalle_response = client.images.generate(
            model="dall-e-3",
            prompt="A 1024×1024 minimal abstract: a neutral background with a single circle split down the middle. Each half is filled with many thin, smooth horizontal bands forming gentle waves in its own color palette. No text, icons, or extra elements—just the clean, layered circle.",
            # prompt=profile_data["image_prompt"],
            size="1024x1024",
            quality="standard",
            n=1
        )
        image_url = dalle_response.data[0].url
        profile_data["image_url"] = image_url
        # Ensure future_outcomes and recommendations are preserved
        # (If not present, provide defaults)
        profile_data["future_outcomes"] = profile_data.get("future_outcomes", "")
        profile_data["recommendations"] = profile_data.get("recommendations", [])
        return profile_data
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse profile JSON")


@app.post("/submit-answer")
async def submit_answer(payload: AnswerPayload):
    try:
        process_answer(payload.question_id, payload.answer)

        # --- NEW LOGIC FOR Q3 GPT SEARCH QUERY & CLASSIFICATION ---
        if payload.user_id:
            session_data = user_followup_questions.get(payload.user_id)
            if session_data and session_data.get("matched"):
                print("User already matched — skipping GPT/SerpAPI logic.")
                # Generate the next question directly based on session
                search_summary = session_data.get("search_summary", "")
                answers = session_data.get("answers", [])
                followup_prompt = f"""
                This person is named {payload.name}.
                Based on the original summary: "{session_data['summary']}" and the previous answers: {answers} and the previous information found in the web search {search_summary},
                the last question was: "{payload.last_question}" and the user responded: "{payload.answer}".

                Generate the next best question to better understand this person in a friendly and insightful way (if now you know who they are, just go ahead and ask a focused question).
                Return only the question, no formatting.
                """
                gpt_response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": followup_prompt}],
                    temperature=0.7,
                )
                next_question = gpt_response.choices[0].message.content
                session_data["answers"].append(payload.answer)
                session_data["remaining"] = max(0, session_data["remaining"] - 1)
                return {"nextQuestions": [next_question]}
            elif payload.question_id == 3 and (not session_data or not session_data.get("matched")):
                # Step 1: Ask GPT to generate a more precise search query
                search_prompt = f"Given that the user answered Q3 with: '{payload.answer}', write a Google search query that could help us identify if the person named '{payload.name}' is well known. Be precise and concise."
                print("Generating search query from GPT...")
                search_gen = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": search_prompt}],
                    temperature=0.5,
                )
                suggested_query = search_gen.choices[0].message.content.strip()
                print("[submit-answer] Suggested GPT query:", suggested_query)

                # Step 2: Perform new SerpAPI search using GPT-generated query
                serp_url = f"https://serpapi.com/search.json?q={suggested_query}&api_key={SERP_API_KEY}"
                serp_response = requests.get(serp_url)
                serp_response.raise_for_status()
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

                # Step 3: Ask GPT to summarize it in plain English
                gpt_prompt = f"Based on this search information, does this describe a well-known person named '{payload.name}'? Give a short summary:\n{search_summary}"
                gpt_response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": gpt_prompt}],
                    temperature=0.6,
                )
                summary = gpt_response.choices[0].message.content
                print("GPT Summary:", summary)

                # Step 4: Classify the person
                classification_prompt = f'''
Based on this summary: "{search_summary}", determine:
1. If this person is well known. (if they are well known return true, if not or uncertain return false)
2. How many follow-up questions are needed (if known, return 2; if unknown, return around 7)
3. Provide only the first question to ask them. Make it friendly, personal, and insightful.

Return in this exact JSON format:
{{
  "matched": true or false,
  "number_of_questions": X,
  "first_question": "..."
}}
'''
                print("[submit-answer] Classification prompt:\n", classification_prompt)
                gpt_classify = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": classification_prompt}],
                    temperature=0.7,
                )
                print("[submit-answer] GPT raw classification response:\n", gpt_classify.choices[0].message.content)
                try:
                    result_data = json.loads(gpt_classify.choices[0].message.content)
                    user_followup_questions[payload.user_id] = {
                        "matched": result_data["matched"],
                        "remaining": result_data["number_of_questions"] - 1,
                        "total": result_data["number_of_questions"],
                        "summary": search_summary,
                        "answers": [],
                        "search_summary": search_summary
                    }
                    return {"nextQuestions": [result_data["first_question"]]}
                except json.JSONDecodeError:
                    print("Failed to parse classification JSON.")
        # --- END NEW LOGIC ---

        if payload.user_id in user_followup_questions:
            session = user_followup_questions[payload.user_id]
            # Always append the answer to the session's answers array
            session["answers"].append(payload.answer)

            # Persist search_summary after first request
            if "search_summary" not in session and payload.search_summary:
                session["search_summary"] = payload.search_summary

            if session["remaining"] > 0:
                session["remaining"] -= 1

                # --- Reevaluate question count if person has become recognizable ---
                reevaluate_prompt = f"""
                This person is named {payload.name}.
                Based on the updated summary: "{session['summary']}" and the accumulated answers: {session['answers']},
                do you now recognize this person as well known? How many more follow-up questions are actually needed?

                Return in this exact JSON format:
                {{
                  "matched": true or false,
                  "number_of_questions": X
                }}
                """
                reevaluation = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": reevaluate_prompt}],
                    temperature=0.6,
                )
                try:
                    reevaluation_data = json.loads(reevaluation.choices[0].message.content)
                    print("[submit-answer] Reevaluated GPT classification:", reevaluation_data)
                    # Update remaining and total only if new number is lower (meaning GPT is now more certain)
                    new_total = reevaluation_data.get("number_of_questions")
                    if new_total is not None and new_total < session["total"]:
                        session["remaining"] = max(0, new_total - len(session["answers"]))
                        session["total"] = new_total
                except Exception as err:
                    print("Reevaluation JSON parsing failed or skipped:", err)
                # --- End reevaluation logic ---

                # Use name, history, and last_question in the prompt
                search_summary = session.get("search_summary", "")
                print("Search Summary from session")
                print(f"""search_summary: {search_summary}""")
                
                if len(session["answers"]) == 1:
                    followup_prompt = f"""
                    This person is named {payload.name}.
                    Based on the original summary: "{session['summary']}" and the previous answers: {session['answers']} and the previous information found in the web search {search_summary}.,
                    the last question was: "{payload.last_question}" and the user responded: "{payload.answer}".

                    Generate the next best question to better understand this person in a friendly and insightful way (if now you know who he is, just go ahead and ask a focused question).
                    Return only the question, no formatting .
                    """
                else:
                    followup_prompt = f"""
                    This person is named {payload.name}.

                    Here’s what we know so far:
                    Summary: "{session['summary']}"
                    Answers: {session['answers']}
                    Last question: "{payload.last_question}"
                    Their last answer: "{payload.answer}"

                    Based on that, write a deeper or more reflective follow-up question. Vary the tone or topic — make it feel fresh, not repetitive.
                    Return only the question, no formatting.
                    """
                # Add print statement for debugging
                print("GPT Follow-up Prompt:\n", followup_prompt)

                gpt_response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": followup_prompt}],
                    temperature=0.7,
                )
                next_question = gpt_response.choices[0].message.content
                return {"nextQuestions": [next_question]}
            else:
                return {"nextQuestions": []}
        else:
            next_questions = get_next_questions(payload.user_id)
            if not next_questions:
                next_questions = ["What motivates you to excel in your career?"]

            return {"nextQuestions": next_questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Minimal flow for known users: /submit-known-answer ---
@app.post("/submit-known-answer")
async def submit_known_answer(payload: AnswerPayload):
    try:
        session_data = user_followup_questions.get(payload.user_id)
        if not session_data or not session_data.get("matched"):
            raise HTTPException(status_code=400, detail="User not marked as known.")

        # Append the new answer
        session_data["answers"].append(payload.answer)
        session_data["remaining"] = max(0, session_data["remaining"] - 1)

        search_summary = session_data.get("search_summary", "")
        followup_prompt = f"""
        This person is named {payload.name}.
        Based on the original summary: "{session_data['summary']}" and the previous answers: {session_data['answers']} and the previous information found in the web search {search_summary},
        the last question was: "{payload.last_question}" and the user responded: "{payload.answer}".

        Generate the next best question to better understand this person in a friendly and insightful way (if now you know who they are, just go ahead and ask a focused question).
        Return only the question, no formatting.
        """
        gpt_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": followup_prompt}],
            temperature=0.7,
        )
        next_question = gpt_response.choices[0].message.content
        return {"nextQuestions": [next_question]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




class ProfilePayload(BaseModel):
    name: str
    answers: list[str]
    summary: str
    search_summary: str = ""  
    traits: list = []
    public_data: dict = {}


@app.post("/generate-report")
async def generate_report_endpoint(payload: ProfilePayload):
    profile_data = generate_profile_report_with_image(
        payload.name,
        payload.answers,
        payload.summary,
        payload.search_summary
    )
    return {
        "report": profile_data["summary"],
        "uniqueness_score": profile_data["uniqueness_score"],
        "badge": profile_data.get("badge", ""),
        "image_url": profile_data["image_url"],
        "future_outcomes": profile_data.get("future_outcomes", ""),
        "recommendations": profile_data.get("recommendations", []),
    }


@app.get("/download-report")
async def download_report():
    try:
        report_data = generate_profile_report_with_image(name="Anonymous", answers=[], summary="")
        report_text = report_data["summary"]
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
    context: dict = {}


class EnhancedWhoAmIRequest(BaseModel):
    name: str
    user_id: str = None
    answers: list[str] = []
    questions: list[str] = []

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
        region = payload.context.get("region") if payload.context else None
        country = payload.context.get("country") if payload.context else None

        search_query = payload.name
        if region:
            search_query += f" {region}"
        elif country:
            search_query += f" {country}"

        serp_url = (
            f"https://serpapi.com/search.json?q={search_query}&api_key={SERP_API_KEY}"
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
  1. If this person is well known. (if the are well known return true, but if you are not sure or its not known return false)
  2. How many follow-up questions are needed (if its a more known person obviusly is gonna need less questions (2 questions) that someone new that we dont know. if its unknown the questions should be more (around 7)
  3. Provide only the first question to ask them., for this first question: write 1 insightful and friendly follow-up questions to better understand this person’s values and mindset, be more personal if the individual is well known (more about their lifestyle). ask the question to the person that the information was about (Just ask the question, do not answer it, neither add anything else, no introduction neither).
  And if you are *not sure* or its a not-known person or new user use this method: Write 1 insightful and friendly questions to better understand a new user, you can use this template or modify it depending on the infromation you got from the summary: Which field or profession are you most associated with? (something that can be helpfull in a google search to find this person)

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
                "matched": followup_data["matched"],
                "remaining": followup_data["number_of_questions"] - 1,
                "total": followup_data["number_of_questions"],
                "summary": summary,
                "answers": [],
            }

        return {
            "searchResults": organic_results,
            "gpt": {
                "matched": followup_data["matched"],
                "summary": summary,
                "number_of_questions": followup_data["number_of_questions"],
                "first_question": followup_data["first_question"],
                "search_summary": search_summary
            },
        }
    except Exception as e:
        print("Error in /whoami:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# --- New enhanced-whoami endpoint ---
@app.post("/enhanced-whoami")
async def enhanced_who_am_i(payload: EnhancedWhoAmIRequest):
    try:
        context_info = f"Name: {payload.name}\n"
        for i in range(min(5, len(payload.answers))):
            question = payload.questions[i] if i < len(payload.questions) else f"Question {i+1}"
            answer = payload.answers[i]
            context_info += f"{question}: {answer}\n"
            print(context_info)
        print("Context Info for GPT:", context_info)
        search_gen_prompt = f"""
Given the following information about a person, generate a concise and precise Google search query that could help us identify if the person is well known. Focus the query to surface key information or notable results.

{context_info}

Return only the search query string.
        """

        search_gen = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": search_gen_prompt}],
            temperature=0.5,
        )
        search_query = search_gen.choices[0].message.content.strip()
        print("Generated Search Query:", search_query)

        serp_url = (
            f"https://serpapi.com/search.json?q={search_query}&api_key={SERP_API_KEY}"
        )
        print("SerpAPI URL:", serp_url)
        serp_response = requests.get(serp_url)
        serp_response.raise_for_status()
        results = serp_response.json()
        organic_results = results.get("organic_results")
        if not organic_results:
            raise ValueError("No organic_results found in SerpAPI response")
        print(organic_results)
        snippets = []
        for result in organic_results[:5]:
            title = result.get("title", "")
            snippet = result.get("snippet", "")
            snippets.append(f"{title}: {snippet}")
        search_summary = "\n".join(snippets)
        # print("Search Summary:", search_summary)
        print("this is before the prompt")
        # gpt_prompt = f"Based on this search information, does this describe a well-known person named '{payload.name}'? here's the information: \n{search_summary} Now Give a short summary:"
        # print("GPT Prompt for Summary:", gpt_prompt)
        # print("we got here")
        # # print("GPT Prompt for Summary:", gpt_prompt)
        # print(gpt_prompt)
        # gpt_response = client.chat.completions.create(
        #     model="gpt-3.5-turbo",
        #     messages=[{"role": "user", "content": gpt_prompt}],
        #     temperature=0.6,
        # )
        # print("HEREEEE")
        # print(gpt_response)
        # summary = gpt_response.choices[0].message.content
        # print("GPT Summary:", summary)

        gpt_followup_prompt = f"""
Based on this summary: "{search_summary}", determine:
  1. If this person is well known. (if the are well known return true, but if you are not sure or its not known return false)
  2. How many follow-up questions are needed (if its a more known person obviusly is gonna need less questions (2 questions) that someone new that we dont know. if its unknown the questions should be more (around 7)
  3. Provide only the first question to ask them., for this first question: write 1 insightful and friendly follow-up questions to better understand this person’s values and mindset, be more personal if the individual is well known (more about their lifestyle). ask the question to the person that the information was about (Just ask the question, do not answer it, neither add anything else, no introduction neither).
  And if you are *not sure* or its a not-known person or new user use this method: Write 1 insightful and friendly questions to better understand a new user, you can use this template or modify it depending on the infromation you got from the summary: Which field or profession are you most associated with? (something that can be helpfull in a google search to find this person)

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
        followup_data = json.loads(followup_data_raw)
        print("Parsed follow-up JSON:", followup_data)
        if payload.user_id:
            user_followup_questions[payload.user_id] = {
                "matched": followup_data["matched"],
                "remaining": followup_data["number_of_questions"] - 1,
                "total": followup_data["number_of_questions"],
                "summary": search_summary,
                "answers": [],
            }

        return {
            "searchResults": organic_results,
            "gpt": {
                "matched": followup_data["matched"],
                "summary": search_summary,
                "number_of_questions": followup_data["number_of_questions"],
                "first_question": followup_data["first_question"],
            },
        }
    except Exception as e:
        print("Error in /enhanced-whoami:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
