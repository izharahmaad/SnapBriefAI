# SnapBrief AI

> Turn messy thoughts into clear, actionable briefs.

A polished AI-powered mobile workspace built with **Expo + React Native + TypeScript** and a **FastAPI + Python** backend.

## Product

SnapBrief takes unstructured notes, messages, meeting fragments, or ideas and converts them into a compact brief:

- title and one-line summary
- key points
- next actions
- tags
- priority
- due date when it can be inferred

It also stores recent briefs locally so the app feels like a small real product rather than a single API demo.

## Architecture

```text
apps/mobile
  ├── screens        UI / product flows
  ├── components     reusable design system pieces
  ├── lib            API + local storage
  ├── theme          typography, spacing, colors
  └── types          shared UI contracts

services/api
  ├── api            HTTP routes
  ├── core           settings / app configuration
  ├── schemas        request + response contracts
  ├── services       AI orchestration
  └── models         domain models
```

## Stack

**Mobile:** Expo, React Native, TypeScript, Expo Router, AsyncStorage, Ionicons

**Backend:** Python, FastAPI, Pydantic, httpx

**AI:** Gemini-compatible Generative Language API

## Run the mobile app

```bash
cd apps/mobile
npm install
npx expo start
```

Create `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000
```

Use your computer's LAN IP when testing on a physical phone. `127.0.0.1` points back to the phone itself.

## Run the backend

```bash
cd services/api
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create `services/api/.env`:

```env
APP_NAME=SnapBrief API
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-2.5-flash
ALLOWED_ORIGINS=*
```

Start it:

```bash
python run.py
```

API docs: `http://127.0.0.1:8000/docs`

## API

### `POST /v1/briefs/generate`

Request:

```json
{
  "content": "client meeting tomorrow at 3, redesign budget around 120k, three week deadline",
  "tone": "professional"
}
```

Response:

```json
{
  "title": "Client Website Redesign",
  "summary": "Review the redesign scope, budget, and delivery timeline.",
  "key_points": [
    "Budget: PKR 120,000",
    "Timeline: 3 weeks"
  ],
  "actions": [
    "Confirm scope with the client",
    "Discuss payment terms"
  ],
  "tags": ["client", "website", "deadline"],
  "priority": "high",
  "due_date": "tomorrow"
}
```

## Security note

For production, keep the AI credential only on the backend. Do not ship a provider key inside the Expo bundle.

## GitHub description

**A polished AI mobile workspace that turns messy notes into clear briefs using React Native, TypeScript, FastAPI, Python, and LLMs.**
