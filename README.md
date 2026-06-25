# Recipe Remixer

## Pitch
Recipe Remixer lets you enter ingredients you have
so that you get instant AI-generated recipe ideas
without going to the store.

## User
Someone who opens the fridge, sees random ingredients,
and has no idea what to cook.

## Data
- Ingredient: { name, quantity }
- Recipe: { title, ingredients[], steps, createdAt }

## AI Feature
User enters ingredients → Groq LLM (llama3-70b-8192) generates 3 personalized recipes → displayed in UI

## Core Screens
1. Home — enter ingredients
2. Results — see 3 AI recipe suggestions
3. Detail — view full recipe steps

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
