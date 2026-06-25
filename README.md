# Recipe Remixer 🍳✨

Transform your random pantry ingredients into extraordinary, chef-crafted meals in seconds using the power of AI.

## 🚀 Overview
Recipe Remixer is a premium, AI-powered web application designed for anyone who opens their fridge, sees random ingredients, and has no idea what to cook. Simply enter what you have, and our culinary AI engine will instantly generate three highly personalized, delicious recipes tailored specifically to your pantry.

**Live URL:** [https://recipe-remixer.vercel.app](https://recipe-remixer.vercel.app) *(or your specific Vercel deployment link)*

## ✨ Key Features
- **Smart Ingredient Input:** Quickly add ingredients via text or interactive, categorized chips.
- **AI Recipe Generation:** Real-time integration with Groq's LLaMA 3 model (`llama-3.3-70b-versatile` / `llama3-70b-8192`) to instantly craft 3 unique recipes.
- **Detailed Recipe Cards:** Every generated recipe includes title, description, dynamic prep/cook times, full ingredient list, step-by-step instructions, difficulty badges, and calculated macros (Calories, Protein, Carbs).
- **Personal Collection:** Securely sign in to save your favorite AI recipes forever.
- **Advanced Management:** Search, sort (by Latest, Difficulty, or Cook Time), edit, or export your saved recipes as a text file.
- **Responsive & Premium UI:** Built with dark-mode glassmorphism, fluid animations, and a layout that looks stunning on every device from ultra-wide desktops to small mobile phones.

## 🛠 Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Vanilla CSS (Glassmorphism, CSS Grid, Fluid Typography)
- **Database:** MongoDB (Mongoose)
- **Authentication:** NextAuth.js (Credentials Provider)
- **AI Integration:** Groq SDK (Llama 3 70B)
- **Deployment:** Vercel

## 🤖 AI Feature Architecture
1. **User Input:** User enters a list of available ingredients on the home page.
2. **AI Generation:** The backend sends a carefully engineered JSON schema prompt to the Groq LLM (llama3-70b-8192).
3. **Structured Output:** The AI generates 3 personalized recipes, returning them precisely in the requested JSON format.
4. **UI Rendering:** The application securely parses the JSON and beautifully displays the recipes in interactive, printable, and savable UI cards.

## 📦 Getting Started

First, install dependencies:
```bash
npm install
```

Create a `.env.local` file with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
