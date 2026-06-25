# Recipe Remixer 🍳

> AI-powered recipe generator — enter ingredients,
> get personalized recipes instantly.

## 🎯 One-Line Pitch
Recipe Remixer lets you enter ingredients 
you have so that you get instant AI-generated 
recipe ideas without going to the store.

## 👤 The User
Someone who opens the fridge, sees random 
ingredients, and has no idea what to cook.

## 📊 The Data
- Ingredient: { name, quantity }
- Recipe: { title, ingredients[], steps[], 
  difficulty, cookTime, servings, createdAt }

## 🤖 The AI Feature
The model takes a list of ingredients entered 
by the user and returns 3 personalized recipe 
suggestions with full cooking instructions.

## 🖥️ Core Screens
1. Home — enter ingredients + quick add chips
2. Results — 3 AI generated recipe cards
3. Saved — personal recipe collection
4. Login — secure authentication

## 🌐 Live Demo
https://reciperemixer.vercel.app

## ▶️ How to Run
1. Clone: git clone https://github.com/Hiran-Antony/recipe-remixer
2. Install: npm install
3. Add .env.local:
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   GROQ_API_KEY=your_groq_key
4. Run: npm run dev
5. Open: http://localhost:3000

## ✨ Features
- 🤖 Real AI recipes via Groq (llama3-70b-8192)
- 🔒 Authentication with NextAuth.js
- 💾 Save recipes to MongoDB Atlas
- 🛡️ Error handling & input guardrails
- 📱 Mobile responsive design
- ⚡ Fast loading with skeleton states

## 🛠️ Tech Stack
- Next.js 14 (App Router + TypeScript)
- MongoDB Atlas + Mongoose
- NextAuth.js (Google + Email auth)
- Groq SDK (llama3-70b-8192)
- Tailwind CSS + Framer Motion

## 🔒 Key Safety
- API keys stored in environment variables only
- Never exposed to frontend/browser
- Input validation and abuse prevention
