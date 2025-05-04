# 🧠 AIknows.me

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build with FastAPI](https://img.shields.io/badge/backend-FastAPI-green)](https://fastapi.tiangolo.com/)
[![OpenAI Powered](https://img.shields.io/badge/AI-GPT--3.5-orange)](https://openai.com)
[![Supabase](https://img.shields.io/badge/database-Supabase-3FCF8E)](https://supabase.com)
[![Vercel Deploy](https://img.shields.io/badge/frontend-Next.js-black?logo=vercel)](https://nextjs.org/)

> **AI-powered personality profiler** that uses your name, public presence, and adaptive questions to generate a unique digital identity — like how the internet might perceive you.

---

## 🌐 How It Works

1. You enter your **name** (optionally LinkedIn/GitHub/etc.)
2. System searches for **public info** (via SerpAPI)
3. If little is found, GPT asks you **insightful questions**
4. GPT blends all info into a **profile summary**
5. Profile is **saved and downloadable**
6. You can **share**, **view**, or **export** it

---

## 🧠 Tech Stack

| Layer      | Tech             |
|------------|------------------|
| Frontend   | Next.js          |
| Backend    | FastAPI (Python) |
| AI         | OpenAI GPT-3.5 (variable)   |
| DB         | Supabase         |
| Search     | SerpAPI          |
| Hosting    | Vercel (Frontend)|

---

## 🛠️ Setup Guide

### 🔄 Clone the Repo

```bash
git clone https://github.com/yourusername/ai-knows.me.git
cd ai-knows.me
```

---

### ⚙️ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env`:

```env
OPENAI_API_KEY=your_openai_key
OPENAI_ORG_ID=your_openai_org
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_key
SERP_API_KEY=your_serpapi_key
```

Run:

```bash
uvicorn main:app --reload
```

➡️ `http://localhost:8000`

---

### 🖼️ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

➡️ `http://localhost:3000`

---

## 🗃️ Supabase Table: `profiles`

| Column        | Type     |
|---------------|----------|
| `id`          | UUID (PK) |
| `name`        | TEXT      |
| `summary`     | TEXT      |
| `traits`      | JSON      |
| `answers`     | JSON      |
| `public_data` | JSON      |
| `auth_id`     | TEXT (nullable) |
| `created_at`  | TIMESTAMP |

---

## ✨ Features

- Adaptive GPT follow-ups based on user answers
- Public profile summarization
- PDF export (WIP)
- Personalized DALL·E image prompt
- Supabase DB sync
- Shareable frontend (Next.js)

---

## 💡 Coming Soon

- [ ] Public URLs for profiles (e.g. `ai-knows.me/david`)
- [ ] DALL·E image rendering
- [ ] Gamified identity badges
- [ ] Enhanced LinkedIn/GitHub parsing
- [ ] AI-powered career suggestions
- [ ] AI automated connections
            
---

## 🤝 Contributing

```bash
# Make a new feature branch
git checkout -b feature/cool-idea

# Push your changes
git push origin feature/cool-idea
```

Open a PR and let's build.

---

## 📜 License

This project is under the [MIT License](LICENSE).

---

## ✍️ Author

**David Martinez**  
[LinkedIn](https://linkedin.com/in//davidmr321/) • [GitHub](https://github.com/321david123)

---

> Made with curiosity, caffeine, and GPT ❤️
