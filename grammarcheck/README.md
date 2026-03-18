# GrammarCheck 🖊️
### Grammarly-lite — Node.js + Express + PostgreSQL | Vanilla JS Frontend

A clean, modern grammar checker web app with real-time analysis, history tracking, and optional OpenAI-powered deep checking.

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14 (running locally or remote)

### 2. Clone & Install

```bash
cd backend
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Then edit .env:
```

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/grammarcheck
PORT=3001
NODE_ENV=development
# Optionally set OPENAI_API_KEY=sk-... for richer AI analysis
```

### 4. Create the Database

```bash
createdb grammarcheck                   # create DB (if it doesn't exist)
npm run migrate                         # run migrations.sql
```

Or run manually:
```bash
psql -d grammarcheck -f src/db/migrations.sql
```

### 5. Start the Backend

```bash
npm run dev      # development (nodemon hot-reload)
# or
npm start        # production
```

Server starts at: **http://localhost:3001**

### 6. Open the Frontend

Simply open `frontend/index.html` in your browser — no build step needed.

---

## 🏗 Project Structure

```
grammarcheck/
├── backend/
│   ├── src/
│   │   ├── server.js                 ← Express entry point
│   │   ├── routes/
│   │   │   ├── check.js              ← POST /api/check
│   │   │   └── history.js            ← GET/DELETE /api/history
│   │   ├── controllers/
│   │   │   ├── checkController.js
│   │   │   └── historyController.js
│   │   ├── services/
│   │   │   └── grammarService.js     ← Core logic (rules + optional OpenAI)
│   │   └── db/
│   │       ├── index.js              ← PostgreSQL pool
│   │       └── migrations.sql        ← Table definitions
│   ├── .env.example
│   └── package.json
└── frontend/
    └── index.html                    ← Complete single-file frontend
```

---

## 🔌 API Reference

### `POST /api/check`
```json
// Request
{ "text": "I recieve alot of emails everyday." }

// Response
{
  "id": "uuid",
  "score": 68,
  "corrected_text": "I receive a lot of emails every day.",
  "issues": [
    {
      "type": "spelling",
      "message": "Possible spelling mistake",
      "offset": 2,
      "length": 7,
      "suggestion": "receive"
    }
  ],
  "created_at": "2025-01-01T12:00:00.000Z"
}
```

### `GET /api/history?limit=10&offset=0`
```json
{
  "data": [ ...check records ],
  "total": 42,
  "limit": 10,
  "offset": 0
}
```

### `DELETE /api/history/:id`
```json
{ "success": true }
```

### `GET /health`
```json
{ "status": "ok", "uptime": 42.1 }
```

---

## 🤖 Grammar Engine

### Without OpenAI key (default)
Uses a built-in rule engine with **50+ rules** covering:
- Spelling: `recieve`, `teh`, `seperate`, `definately`, `alot`, etc.
- Grammar: `a`/`an`, `your`/`you're`, `should of`, `less`/`fewer`, etc.
- Punctuation: double commas, spaces before punctuation, etc.
- Style: wordiness, redundant phrases, overused filler words

### With OpenAI key
Sets `OPENAI_API_KEY` in `.env` → uses **GPT-4o-mini** for deep contextual analysis with accurate character-level offsets.

---

## 🎨 Frontend Features

| Feature | Detail |
|---|---|
| Score Badge | 0–100, color-coded: 🟢 ≥80 · 🟡 60–79 · 🔴 <60 |
| Issue Cards | Type icon + message + Apply button |
| Apply Button | One-click fix inserted into textarea |
| Highlight | Click card → selects text in textarea |
| Copy Button | Copies corrected text to clipboard |
| History Tab | Paginated list with delete + re-check |
| Keyboard shortcut | Ctrl/Cmd + Enter to check |
| Responsive | Mobile-friendly layout |

---

## 🧪 Test it manually

```bash
curl -X POST http://localhost:3001/api/check \
  -H "Content-Type: application/json" \
  -d '{"text": "I recieve alot of mails everyday but their not always helpfull."}'
```

---

## License
MIT
