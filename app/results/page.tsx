"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface RecipeData {
  title: string;
  ingredients: string[];
  steps: string[];
  cookTime: string;
  servings: string | number;
  difficulty: "Easy" | "Medium" | "Hard";
}

function ResultsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const ingredientsParam = searchParams.get("ingredients") || "";

  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!ingredientsParam) {
      router.push("/");
      return;
    }

    let isMounted = true;

    const fetchRecipes = async () => {
      const start = Date.now();
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients: ingredientsParam })
        });
        
        if (!res.ok) throw new Error("Failed to generate recipes");
        
        const data = await res.json();
        
        if (!isMounted) return;

        // Ensure at least 2.5s loading time for the animation
        const elapsed = Date.now() - start;
        const remainingDelay = Math.max(0, 2500 - elapsed);
        
        setTimeout(() => {
          if (isMounted) {
            setRecipes(data.recipes || []);
            setLoading(false);
          }
        }, remainingDelay);
      } catch (err) {
        console.error("Error generating recipes:", err);
        if (!isMounted) return;
        const elapsed = Date.now() - start;
        const remainingDelay = Math.max(0, 2500 - elapsed);
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, remainingDelay);
      }
    };

    fetchRecipes();

    return () => {
      isMounted = false;
    };
  }, [ingredientsParam, router]);

  const handleSave = async (recipe: RecipeData, idx: number) => {
    if (!session) {
      router.push("/login");
      return;
    }
    
    setSavingIdx(idx);
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe)
      });
      const data = await res.json();
      if (data.success) {
        alert("Recipe saved to your collection!");
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error saving recipe");
    } finally {
      setSavingIdx(null);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "#10b981"; // Emerald green
      case "Medium": return "#f59e0b"; // Amber/Orange
      case "Hard": return "#ef4444"; // Red
      default: return "#888";
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="animate-spin" style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍳</div>
        <h2 className="shimmer-text" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "1.5rem" }}>
          AI is crafting your recipes...
        </h2>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Analyzing {ingredientsParam}...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, margin: 0 }}>
            Your <span style={{ color: "#f97316" }}>AI Recipes</span>
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
            Based on: {ingredientsParam}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          {recipes.map((recipe, idx) => (
            <div key={idx} className="glass-card animate-fade-in-up" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", animationDelay: `${idx * 150}ms` }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h2 style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "#fff" }}>
                  {recipe.title}
                </h2>
                <span style={{
                  background: `${getDifficultyColor(recipe.difficulty)}22`,
                  color: getDifficultyColor(recipe.difficulty),
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase"
                }}>
                  {recipe.difficulty}
                </span>
              </div>

              <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <span>⏱️ {recipe.cookTime}</span>
                <span>🍽️ {recipe.servings} Servings</span>
              </div>

              <div>
                <h3 style={{ fontSize: "0.9rem", color: "#fb923c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Ingredients</h3>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.6, listStyleType: "disc" }}>
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="list-item-anim" style={{ animationDelay: `${i * 80}ms`, paddingLeft: "0.2rem", paddingBottom: "0.2rem" }}>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: "0.9rem", color: "#fb923c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Steps</h3>
                <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.6, listStyleType: "decimal" }}>
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="list-item-anim" style={{ animationDelay: `${(recipe.ingredients.length + i) * 80}ms`, paddingLeft: "0.3rem", paddingBottom: "0.4rem" }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                <button
                  onClick={() => handleSave(recipe, idx)}
                  disabled={savingIdx === idx}
                  className="btn-primary"
                  style={{ width: "100%", padding: "0.75rem", fontSize: "0.95rem" }}
                >
                  {savingIdx === idx ? "Saving..." : "💾 Save to Collection"}
                </button>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="animate-spin" style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍳</div>
        <h2 className="shimmer-text" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "1.5rem" }}>
          Loading your experience...
        </h2>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}
