# SnapBrief Mobile

The mobile client for **SnapBrief AI**, built with Expo and Expo Router.

SnapBrief helps turn rough notes, meeting details, ideas, tasks, and transcripts into structured briefs with summaries, key points, priorities, tags, and next actions.

## Features

- AI-powered brief generation
- Clean and structured output
- Key points and next actions
- Priority and due-date information
- Tags for organization
- Saved brief history
- Synthesis workspace
- Vault for reviewing saved briefs
- Quick-start input examples
- Pull-to-refresh and automatic workspace updates
- Responsive mobile UI

## Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- FastAPI backend
- AsyncStorage
- Expo Vector Icons
- Expo Linear Gradient

## Project Structure

```text
apps/mobile/
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