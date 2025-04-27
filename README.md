
# AIknows.me
---

**AIknows.me** is an AI-powered personality profiler that generates a unique profile based on your name, online presence, and a few interactive questions. It’s designed to simulate how the internet might “see” you — turning fragmented online data and personal input into a compelling, shareable digital identity.

Whether you’re known online or completely under the radar, the system builds an accurate profile using GPT, adapting based on what it finds about you.

---

## 🌐 How It Works

1. **You enter your name** (or LinkedIn/GitHub/etc).
2. The system searches for public info about you (e.g., LinkedIn, GitHub, personal websites).
3. If not much is found, it asks you questions to help build a profile.
4. It blends everything into a GPT prompt and generates your AI profile.
5. Your profile is saved (locally and optionally in Supabase).
6. You can come back and see it again or share it with others.

---
# nowworks
---

## 🔧 New Additions

### Backend: `profile_controller.py`
Handles:
- Saving user profile data to Supabase
- Fetching saved profile data by UUID

Environment variables required:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

---

## 🔌 Setup (Backend)

1. Create `.env` file in `/backend` with:
```
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_KEY=your_secret_key
```

2. Run with:
```bash
uvicorn main:app --reload
```

3. Ensure dependencies:
```bash
pip install -r requirements.txt
```

---

## 📦 Supabase Table Schema: `profiles`

| Column      | Type      |
|-------------|-----------|
| id          | UUID (PK) |
| name        | TEXT      |
| summary     | TEXT      |
| traits      | JSON      |
| answers     | JSON      |
| public_data | JSON      |
| auth_id     | TEXT (nullable) |
| created_at  | TIMESTAMP |
