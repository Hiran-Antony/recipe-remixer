"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Link from "next/link";

const SoftAurora = dynamic(() => import("@/components/SoftAurora"), { ssr: false });

interface RecipeData {
  _id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  cookTime: string;
  servings: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function SavedRecipesPage() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<RecipeData | null>(null);

  const fetchRecipes = async () => {
    try {
      const res = await fetch("/api/recipes?userOnly=true");
      const data = await res.json();
      if (data.success) {
        setRecipes(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchRecipes();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRecipes(prev => prev.filter(r => r._id !== id));
      } else {
        alert("Failed to delete: " + data.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const startEdit = (recipe: RecipeData) => {
    setEditingId(recipe._id);
    setEditForm(recipe);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm) return;
    try {
      const res = await fetch(`/api/recipes/${editForm._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        setRecipes(prev => prev.map(r => r._id === editForm._id ? data.data : r));
        setEditingId(null);
        setEditForm(null);
      } else {
        alert("Failed to update: " + data.error);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "#10b981"; // Green
      case "Medium": return "#f97316"; // Orange
      case "Hard": return "#ef4444"; // Red
      default: return "#888";
    }
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <SoftAurora speed={0.3} color1="#f97316" color2="#db2777" noiseFrequency={2.0} bandHeight={0.6} />
      </div>

      <main style={{ position: "relative", zIndex: 1, minHeight: "100vh", padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="shimmer-text animate-fade-in-up" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800, margin: 0 }}>
            Saved Collection
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
            Your personal cookbook of AI-generated masterpieces.
          </p>
        </div>

        {status === "unauthenticated" ? (
          <div className="glass-card animate-fade-in-up" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>🔒</span>
            <h2 style={{ fontSize: "1.5rem", color: "#fff", marginBottom: "0.5rem" }}>Please Sign In</h2>
            <p style={{ marginBottom: "1.5rem" }}>You need to be signed in to view and save your personal recipe collection.</p>
            <Link href="/login" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", width: "auto" }}>
              Sign In
            </Link>
          </div>
        ) : loading || status === "loading" ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1.2rem" }}>
            <div className="animate-spin" style={{ fontSize: "2rem", marginBottom: "1rem" }}>🍳</div>
            Loading your recipes...
          </div>
        ) : recipes.length === 0 ? (
          <div className="glass-card animate-fade-in-up delay-200" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>📖</span>
            <h2 style={{ fontSize: "1.5rem", color: "#fff", marginBottom: "0.5rem" }}>No recipes yet</h2>
            <p>Go back to the home page and let the AI chef cook something up for you!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
            {recipes.map((recipe, idx) => {
              if (editingId === recipe._id && editForm) {
                return (
                  <div key={recipe._id} className="glass-card animate-fade-in-up" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input 
                      value={editForm.title} 
                      onChange={e => setEditForm({...editForm, title: e.target.value})}
                      style={{ width: "100%", padding: "0.5rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "4px", fontSize: "1.2rem", fontFamily: "var(--font-outfit)" }}
                      placeholder="Recipe Title"
                    />
                    
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input 
                        value={editForm.cookTime}
                        onChange={e => setEditForm({...editForm, cookTime: e.target.value})}
                        style={{ flex: 1, padding: "0.5rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "4px" }}
                        placeholder="Cook Time"
                      />
                      <input 
                        value={editForm.servings}
                        onChange={e => setEditForm({...editForm, servings: e.target.value})}
                        style={{ flex: 1, padding: "0.5rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "4px" }}
                        placeholder="Servings"
                      />
                    </div>
                    
                    <div>
                      <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "block" }}>Ingredients (comma separated)</label>
                      <textarea 
                        value={editForm.ingredients.join(", ")}
                        onChange={e => setEditForm({...editForm, ingredients: e.target.value.split(",").map(i => i.trim()).filter(Boolean)})}
                        style={{ width: "100%", padding: "0.5rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "4px", minHeight: "60px", resize: "vertical" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "block" }}>Steps (one per line)</label>
                      <textarea 
                        value={editForm.steps.join("\n")}
                        onChange={e => setEditForm({...editForm, steps: e.target.value.split("\n").filter(Boolean)})}
                        style={{ width: "100%", padding: "0.5rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "4px", minHeight: "100px", resize: "vertical" }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "auto", paddingTop: "0.5rem" }}>
                      <button onClick={cancelEdit} style={{ flex: 1, padding: "0.5rem", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: "4px", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>Cancel</button>
                      <button onClick={saveEdit} style={{ flex: 1, padding: "0.5rem", background: "#f97316", border: "none", color: "#fff", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#ea580c"} onMouseOut={e => e.currentTarget.style.background = "#f97316"}>Save</button>
                    </div>
                  </div>
                );
              }

              return (
              <div key={recipe._id} className="glass-card animate-fade-in-up" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", animationDelay: `${idx * 100}ms` }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h2 style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "#fff", flex: 1, paddingRight: "1rem" }}>
                    {recipe.title}
                  </h2>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button 
                      onClick={() => startEdit(recipe)}
                      style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.2rem", transition: "color 0.2s" }}
                      onMouseOver={e => e.currentTarget.style.color = "#3b82f6"}
                      onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                      aria-label="Edit recipe"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(recipe._id)}
                      style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.2rem", transition: "color 0.2s" }}
                      onMouseOver={e => e.currentTarget.style.color = "#ef4444"}
                      onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                      aria-label="Delete recipe"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
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
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>• ⏱️ {recipe.cookTime}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>• 🍽️ {recipe.servings || "N/A"} Servings</span>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "0.5rem" }}>
                  <strong style={{ color: "#f97316", display: "block", marginBottom: "0.25rem" }}>{recipe.ingredients.length} Ingredients:</strong>
                  {recipe.ingredients.join(", ")}
                </div>

                <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
                  <details style={{ cursor: "pointer" }}>
                    <summary style={{ fontSize: "0.9rem", color: "#a855f7", fontWeight: 600, userSelect: "none" }}>View Steps</summary>
                    <ol style={{ marginTop: "1rem", paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                      {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </details>
                </div>
                
              </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
