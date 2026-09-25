# SnapBrief AI

> Turn messy thoughts into clear, actionable briefs.

SnapBrief AI is an AI-powered mobile workspace that transforms unstructured notes, meeting fragments, ideas, messages, and transcripts into concise, structured briefs.

Instead of manually organizing raw information, SnapBrief extracts the useful signal and presents it as a clear summary with key points, next actions, tags, priority, and optional due-date information.

The project combines a polished React Native + Expo mobile client with a FastAPI + Python backend and a Gemini-compatible generative AI service.

---

## Product

SnapBrief is built around one simple workflow:

    Capture
       ↓
    Structure
       ↓
    Review
       ↓
    Act

Give SnapBrief something unstructured:

    Client meeting tomorrow at 3.
    Redesign budget is around 120k.
    Need to confirm payment terms.
    Three-week deadline.

SnapBrief turns it into a structured brief:

    CLIENT WEBSITE REDESIGN

    Summary
    Review the redesign scope, budget, payment terms,
    and three-week delivery timeline.

    Key Points
    • Budget identified
    • Three-week delivery timeline
    • Payment terms require confirmation

    Next Actions
    • Confirm project scope
    • Discuss payment terms
    • Review delivery plan

    Tags
    #client   #website   #deadline

    Priority
    High

---

## Core Features

- AI-powered brief generation
- Structured summaries
- Key point extraction
- Next action extraction
- Priority detection
- Tags for organization
- Due-date information when available
- Saved local brief history
- Synthesis workspace
- Searchable and filterable Vault
- Quick-start examples
- Pull-to-refresh support
- Automatic workspace refresh
- Responsive mobile interface
- Dark interface with aqua brand accents

---

## Architecture

    SnapBrief AI
    │
    ├── apps/
    │   └── mobile/
    │       │
    │       ├── app/
    │       │   ├── _layout.tsx
    │       │   ├── splash.tsx
    │       │   ├── onboarding.tsx
    │       │   │
    │       │   └── (tabs)/
    │       │       ├── _layout.tsx
    │       │       ├── home.tsx
    │       │       ├── synthesis.tsx
    │       │       ├── vault.tsx
    │       │       ├── history.tsx
    │       │       └── settings.tsx
    │       │
    │       └── src/
    │           ├── components/
    │           ├── constants/
    │           ├── lib/
    │           ├── screens/
    │           ├── theme/
    │           └── types/
    │
    └── services/
        └── api/
            │
            ├── api/
            ├── core/
            ├── schemas/
            ├── services/
            └── models/

### Responsibility Split

    Mobile Client
    │
    ├── UI
    ├── Navigation
    ├── User input
    ├── Local storage
    └── API communication
            │
            ▼
    FastAPI Backend
    │
    ├── HTTP routes
    ├── Request validation
    ├── AI orchestration
    └── Structured response
            │
            ▼
    Generative AI

The mobile application focuses on the product experience, while the backend handles API requests, validation, and AI orchestration.

---

## Technology Stack

### Mobile

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage
- Expo Vector Icons
- Expo Linear Gradient
- React Native Safe Area Context

### Backend

- Python
- FastAPI
- Pydantic
- HTTPX

### AI

- Gemini-compatible Generative Language API
- Gemini 2.5 Flash

---

## Project Structure

### Mobile

    apps/mobile/
    │
    ├── app/
    │   ├── _layout.tsx
    │   ├── splash.tsx
    │   ├── onboarding.tsx
    │   │
    │   └── (tabs)/
    │       ├── _layout.tsx
    │       ├── home.tsx
    │       ├── synthesis.tsx
    │       ├── vault.tsx
    │       ├── history.tsx
    │       └── settings.tsx
    │
    ├── src/
    │   ├── components/
    │   │   ├── BriefResult.tsx
    │   │   ├── Chip.tsx
    │   │   ├── GlassCard.tsx
    │   │   └── SectionTitle.tsx
    │   │
    │   ├── constants/
    │   │   └── examples.ts
    │   │
    │   ├── lib/
    │   │   ├── api.ts
    │   │   └── storage.ts
    │   │
    │   ├── screens/
    │   │   └── HomeScreen.tsx
    │   │
    │   ├── theme/
    │   │   └── index.ts
    │   │
    │   └── types/
    │       └── brief.ts
    │
    ├── assets/
    │   └── images/
    │
    ├── .env
    ├── app.json
    ├── package.json
    └── tsconfig.json

### Backend

    services/api/
    │
    ├── api/
    │   └── routes
    │
    ├── core/
    │   └── application settings
    │
    ├── schemas/
    │   └── request and response contracts
    │
    ├── services/
    │   └── AI orchestration
    │
    ├── models/
    │   └── domain models
    │
    ├── .env
    ├── requirements.txt
    └── run.py

---

## Getting Started

### 1. Clone the Repository

    git clone https://github.com/izharahmaad/SnapBriefAI.git
    cd SnapBriefAI

---

## Backend Setup

Move into the backend:

    cd services/api

Create a virtual environment:

    python -m venv .venv

### Windows

    .venv\Scripts\activate

### macOS / Linux

    source .venv/bin/activate

Install dependencies:

    pip install -r requirements.txt

---

## Backend Environment

Create:

    services/api/.env

Add:

    APP_NAME=SnapBrief API
    GEMINI_API_KEY=your_api_key
    GEMINI_MODEL=gemini-2.5-flash
    ALLOWED_ORIGINS=*

Keep API credentials inside environment variables.

Never commit API keys or other secrets to Git.

---

## Start the Backend

    python run.py

The API will normally be available at:

    http://127.0.0.1:8000

Interactive API documentation:

    http://127.0.0.1:8000/docs

OpenAPI schema:

    http://127.0.0.1:8000/openapi.json

---

## Mobile Setup

Open a second terminal:

    cd apps/mobile

Install dependencies:

    npm install

Start Expo:

    npx expo start

The application can be opened with:

- Expo Go
- Android emulator
- iOS simulator
- Development build

---

## Mobile Environment

Create:

    apps/mobile/.env

Set the backend URL:

    EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000

Example:

    EXPO_PUBLIC_API_URL=http://192.168.0.196:8000

When testing on a physical phone, use the computer's LAN IP.

Do not use:

    127.0.0.1

for a physical phone connection because it points to the phone itself rather than the development computer.

---

## API

### Generate a Brief

Endpoint:

    POST /v1/briefs/generate

Request:

    {
      "text": "client meeting tomorrow at 3, redesign budget around 120k, three week deadline"
    }

Response:

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
      "tags": [
        "client",
        "website",
        "deadline"
      ],
      "priority": "high",
      "due_date": "tomorrow"
    }

---

## Brief Data Model

The mobile application uses a structured Brief object:

    Brief
    │
    ├── id
    ├── title
    ├── summary
    ├── key_points[]
    ├── actions[]
    ├── tags[]
    ├── priority
    ├── due_date
    └── created_at

Priority values:

    low
    medium
    high

---

## Request Flow

    User enters raw text
            │
            ▼
    Home Screen
            │
            ▼
    generateBrief()
            │
            ▼
    POST /v1/briefs/generate
            │
            ▼
    FastAPI
            │
            ▼
    Request validation
            │
            ▼
    AI orchestration
            │
            ▼
    Structured response
            │
            ▼
    BriefResult
            │
            ├── Display
            │
            └── Save locally

---

## Local Storage

Generated briefs are stored locally on the device using AsyncStorage.

This powers the mobile workspace:

    History
    │
    ├── Saved briefs
    └── Recent activity

    Vault
    │
    ├── Search
    ├── Filters
    └── Archive

    Synthesis
    │
    ├── Brief count
    ├── Today's briefs
    ├── Action count
    ├── Priority information
    └── Recent synthesis

The current mobile workspace does not require a separate database for saved briefs.

---

## Mobile Screens

    Splash
       ↓
    Onboarding
       ↓
    Home
       ├── Create brief
       ├── Input examples
       └── Generated output
            │
            ├── Synthesis
            ├── Vault
            ├── History
            └── Settings

### Home

The main creation workspace for entering raw information and generating a structured brief.

### Synthesis

Provides an overview of generated briefs, actions, priorities, and recent synthesis activity.

### Vault

Provides a searchable and filterable archive of saved briefs.

### History

Provides access to previously generated briefs and workspace activity.

### Settings

Provides application, workspace, privacy, connection, and information settings.

---

## Design System

SnapBrief uses a focused visual language designed around clarity rather than heavy visual effects.

    Deep background
           +
    Dark surfaces
           +
    Aqua brand accent
           +
    Strong typography
           +
    Consistent spacing
           +
    Minimal decoration

### Color System

    Background      #061113
    Surface         #0B181B
    Surface 2       #102326

    Text            #D7E8E7
    Muted           #87A6A5
    Dim             #5D7778
    White           #F3FFFE

    Accent          #2DE1D6
    Accent Soft     #92FFF7
    Accent Deep     #12AAA4

    Danger          #FF7C87

### Spacing

    XS              6
    SM              10
    MD              14
    LG              18
    XL              24
    XXL             32

### Radius

    SM              10
    MD              15
    LG              20
    XL              24
    PILL            999

The design system keeps reusable components visually consistent across the application.

---

## Development Workflow

### Start the Backend

    cd services/api
    python run.py

### Start the Mobile App

    cd apps/mobile
    npx expo start

### Test the API Independently

Open:

    http://127.0.0.1:8000/docs

Swagger UI can be used to verify the backend independently from the mobile client.

---

## Physical Device Development

For a physical device:

    Phone
       │
       │ Local network
       ▼
    Development Computer
       │
       ▼
    FastAPI
       │
       └── :8000

Make sure:

- The phone and computer are connected to the same network.
- The backend is running.
- The mobile `.env` points to the computer's LAN IP.
- Port `8000` is reachable from the device.

Example:

    EXPO_PUBLIC_API_URL=http://192.168.0.196:8000

---

## API Documentation

Once the backend is running:

    Swagger UI
    http://127.0.0.1:8000/docs

    OpenAPI
    http://127.0.0.1:8000/openapi.json

Swagger UI can be used to inspect and test the available API routes.

---

## Security

Development configuration may use permissive settings, but production deployments should use stricter configuration.

Never commit:

    GEMINI_API_KEY

or any other private credentials.

Use environment variables for secrets:

    GEMINI_API_KEY=your_api_key

For production, replace:

    ALLOWED_ORIGINS=*

with the specific origins that should be permitted.

---

## Engineering Principles

### Separation of Concerns

UI, API communication, local storage, validation, AI orchestration, and data contracts remain separated.

### Reusable Components

Common interface elements are implemented as reusable components rather than duplicated across screens.

### Structured Data

AI output is transformed into a consistent Brief model before being rendered and saved.

### Local Workspace

Generated briefs remain available through the mobile workspace after creation.

### Focused Product Flow

SnapBrief is centered around one core task:

> Turn unstructured information into something useful.

---

## Future Direction

Potential extensions include:

    Voice Input
         ↓
    Transcript Processing
         ↓
    Smarter Brief Generation
         ↓
    Search & Indexing
         ↓
    Cloud Synchronization
         ↓
    Authentication
         ↓
    Shared Workspaces

---

## Repository

GitHub:

https://github.com/izharahmaad/SnapBriefAI

---

## License

This project is currently maintained as a personal development and portfolio project.