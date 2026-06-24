"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

interface RecipeData {
  title: string;
  ingredients: string[];
  steps: string[];
  cookTime: string;
  servings: string | number;
  difficulty: "Easy" | "Medium" | "Hard";
  confidenceScore?: number;
  cals?: number;
  protein?: number;
  carbs?: number;
}

function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%" }}>
      <div className="skeleton-box" style={{ height: "140px", width: "100%", borderRadius: "0.5rem" }}></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div className="skeleton-box" style={{ height: "24px", width: "80%" }}></div>
        <div className="skeleton-box" style={{ height: "16px", width: "40%" }}></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div className="skeleton-box" style={{ height: "14px", width: "100%" }}></div>
        <div className="skeleton-box" style={{ height: "14px", width: "90%" }}></div>
        <div className="skeleton-box" style={{ height: "14px", width: "95%" }}></div>
      </div>
      <div className="skeleton-box" style={{ height: "40px", width: "100%", marginTop: "auto", borderRadius: "0.5rem" }}></div>
    </div>
  );
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
      toast("Please sign in to save recipes", { icon: "🔒" });
      router.push("/login");
      return;
    }
    
    setSavingIdx(idx);
    const toastId = toast.loading("Saving recipe...");
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Recipe saved successfully! ✅", { id: toastId });
      } else {
        toast.error("Failed to save: " + data.error, { id: toastId });
      }
    } catch (err) {
      toast.error("Error saving recipe", { id: toastId });
    } finally {
      setSavingIdx(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard! 📋");
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
      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: "1200px" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 className="shimmer-text" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, margin: 0 }}>
              AI is thinking... 🤔
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
              Crafting perfect recipes from: {ingredientsParam}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", flex: "1 0 auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, margin: 0 }}>
            Your <span style={{ color: "#f97316" }}>AI Recipes</span>
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
            Based on: <span style={{ color: "#fff", fontWeight: 500 }}>{ingredientsParam}</span>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2.5rem" }}>
          {recipes.map((recipe, idx) => {
            const confidenceScore = recipe.confidenceScore || 95;
            const cals = recipe.cals || 350;
            const protein = recipe.protein || 20;
            const carbs = recipe.carbs || 30;

            const shareText = `Check out this AI-generated recipe for ${recipe.title}!\n\nIngredients: ${recipe.ingredients.join(", ")}\n\nGenerated by Recipe Remixer 🍳`;

            return (
            <div key={idx} className="glass-card animate-fade-in-up" style={{ display: "flex", flexDirection: "column", overflow: "hidden", animationDelay: `${idx * 150}ms` }}>
              
              {/* Image Placeholder */}
              <div style={{ 
                height: "180px", 
                width: "100%", 
                background: `linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(168,85,247,0.2) 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderBottom: "1px solid rgba(255,255,255,0.05)"
              }}>
                <span style={{ fontSize: "4rem", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))" }}>🍽️</span>
                <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "0.25rem 0.75rem", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.75rem", fontWeight: 700, color: "#10b981" }}>
                  {confidenceScore}% AI Match
                </div>
              </div>

              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
                
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <h2 style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "#fff", lineHeight: 1.3 }}>
                    {recipe.title}
                  </h2>
                  <span style={{
                    background: `${getDifficultyColor(recipe.difficulty)}22`,
                    color: getDifficultyColor(recipe.difficulty),
                    padding: "0.25rem 0.75rem",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    flexShrink: 0
                  }}>
                    {recipe.difficulty}
                  </span>
                </div>

                {/* Meta Info */}
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>⏱️ {recipe.cookTime}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>🍽️ {recipe.servings} Servings</span>
                </div>

                {/* Nutrition Badges */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", color: "var(--text-muted)" }}>🔥 {cals} kcal</span>
                  <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", color: "var(--text-muted)" }}>🥩 {protein}g Protein</span>
                  <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", color: "var(--text-muted)" }}>🌾 {carbs}g Carbs</span>
                </div>

                {/* Ingredients */}
                <div>
                  <h3 style={{ fontSize: "0.85rem", color: "#fb923c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", fontWeight: 700 }}>Ingredients</h3>
                  <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, listStyleType: "disc" }}>
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="list-item-anim" style={{ animationDelay: `${i * 60}ms`, paddingBottom: "0.2rem" }}>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div>
                  <h3 style={{ fontSize: "0.85rem", color: "#fb923c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", fontWeight: 700 }}>Instructions</h3>
                  <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, listStyleType: "decimal" }}>
                    {recipe.steps.map((step, i) => (
                      <li key={i} className="list-item-anim" style={{ animationDelay: `${(recipe.ingredients.length + i) * 60}ms`, paddingBottom: "0.5rem" }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Actions */}
                <div style={{ marginTop: "auto", paddingTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <button
                    onClick={() => handleSave(recipe, idx)}
                    disabled={savingIdx === idx}
                    className="btn-primary"
                    style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}
                  >
                    {savingIdx === idx ? "Saving..." : "💾 Save to Collection"}
                  </button>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button 
                      onClick={() => copyToClipboard(shareText)}
                      style={{ flex: 1, padding: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                      onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                    >
                      🔗 Share
                    </button>
                    <button 
                      onClick={() => window.print()}
                      style={{ flex: 1, padding: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                      onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                    >
                      🖨️ Print
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", flex: "1 0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
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
