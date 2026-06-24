"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-hot-toast";

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
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"Latest" | "Difficulty" | "Cook Time">("Latest");

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<RecipeData | null>(null);

  const fetchRecipes = async () => {
    try {
      const res = await fetch("/api/recipes?userOnly=true");
      const data = await res.json();
      if (data.success) {
        setRecipes(data.data.reverse()); // Assume latest first
      }
    } catch (err) {
      toast.error("Failed to load recipes");
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
    
    const toastId = toast.loading("Deleting...");
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRecipes(prev => prev.filter(r => r._id !== id));
        toast.success("Recipe deleted", { id: toastId });
      } else {
        toast.error("Failed to delete", { id: toastId });
      }
    } catch (err) {
      toast.error("Delete error", { id: toastId });
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
    const toastId = toast.loading("Saving changes...");
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
        toast.success("Recipe updated", { id: toastId });
      } else {
        toast.error("Failed to update", { id: toastId });
      }
    } catch (err) {
      toast.error("Update error", { id: toastId });
    }
  };

  const handleExport = () => {
    if (recipes.length === 0) return;
    let exportText = "My Recipe Collection\n==================\n\n";
    recipes.forEach((r, i) => {
      exportText += `${i + 1}. ${r.title.toUpperCase()}\n`;
      exportText += `Difficulty: ${r.difficulty} | Cook Time: ${r.cookTime} | Servings: ${r.servings}\n\n`;
      exportText += `INGREDIENTS:\n- ${r.ingredients.join("\n- ")}\n\n`;
      exportText += `INSTRUCTIONS:\n`;
      r.steps.forEach((step, idx) => {
        exportText += `${idx + 1}. ${step}\n`;
      });
      exportText += `\n-----------------------------------\n\n`;
    });

    const blob = new Blob([exportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my_recipes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Recipes exported! 💾");
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "#10b981"; // Green
      case "Medium": return "#f97316"; // Orange
      case "Hard": return "#ef4444"; // Red
      default: return "#888";
    }
  };

  const difficultyRank = { Easy: 1, Medium: 2, Hard: 3 };

  const filteredAndSortedRecipes = useMemo(() => {
    let result = recipes.filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (sortBy === "Difficulty") {
      result = result.sort((a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty]);
    } else if (sortBy === "Cook Time") {
      // Basic string comparison sort for cook time (not perfect but works for simple "X mins" strings)
      result = result.sort((a, b) => a.cookTime.localeCompare(b.cookTime, undefined, { numeric: true }));
    }
    // Latest is default order (already handled by fetch array reverse)

    return result;
  }, [recipes, searchQuery, sortBy]);

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <SoftAurora speed={0.3} color1="#f97316" color2="#db2777" noiseFrequency={2.0} bandHeight={0.6} />
      </div>

      <main style={{ position: "relative", zIndex: 1, minHeight: "100vh", flex: "1 0 auto", padding: "4rem 2rem", width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column" }}>
        
        {/* Header section */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="shimmer-text animate-fade-in-up" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800, margin: 0 }}>
            Saved Collection
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
            Your personal cookbook of AI-generated masterpieces.
          </p>
        </div>

        {status === "unauthenticated" ? (
          <div className="glass-card animate-fade-in-up" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", maxWidth: "500px", margin: "2rem auto" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>🔒</span>
            <h2 style={{ fontSize: "1.5rem", color: "#fff", marginBottom: "0.5rem" }}>Please Sign In</h2>
            <p style={{ marginBottom: "1.5rem" }}>You need to be signed in to view and save your personal recipe collection.</p>
            <Link href="/login" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", width: "auto" }}>
              Sign In
            </Link>
          </div>
        ) : loading || status === "loading" ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1.2rem", marginTop: "4rem" }}>
            <div className="animate-spin" style={{ fontSize: "2rem", marginBottom: "1rem" }}>🍳</div>
            Loading your recipes...
          </div>
        ) : recipes.length === 0 ? (
          <div className="glass-card animate-fade-in-up delay-200" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", maxWidth: "500px", margin: "2rem auto" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>📖</span>
            <h2 style={{ fontSize: "1.5rem", color: "#fff", marginBottom: "0.5rem" }}>No recipes yet</h2>
            <p style={{ marginBottom: "1.5rem" }}>Go back to the home page and let the AI chef cook something up for you!</p>
            <Link href="/" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", width: "auto" }}>
              Generate Recipes
            </Link>
          </div>
        ) : (
          <>
            {/* ── Action Bar ── */}
            <div className="glass-card animate-fade-in-up delay-100" style={{ 
              padding: "1rem", 
              marginBottom: "2rem", 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "1rem", 
              alignItems: "center", 
              justifyContent: "space-between",
              position: "sticky",
              top: "5rem",
              zIndex: 40
            }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: "1 1 300px" }}>
                <span style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c", padding: "0.4rem 0.8rem", borderRadius: "99px", fontWeight: 700, fontSize: "0.9rem", border: "1px solid rgba(249,115,22,0.3)" }}>
                  {filteredAndSortedRecipes.length} Saved
                </span>
                <input 
                  type="text" 
                  placeholder="🔍 Search recipes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    color: "#fff",
                    outline: "none",
                    fontFamily: "var(--font-outfit)"
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    color: "var(--text-muted)",
                    outline: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-outfit)"
                  }}
                >
                  <option value="Latest">Sort: Latest</option>
                  <option value="Difficulty">Sort: Difficulty</option>
                  <option value="Cook Time">Sort: Cook Time</option>
                </select>
                <button 
                  onClick={handleExport}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  📥 Export All
                </button>
              </div>
            </div>

            {/* ── Grid ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2.5rem" }}>
              {filteredAndSortedRecipes.map((recipe, idx) => {
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
                <div key={recipe._id} className="glass-card animate-fade-in-up" style={{ display: "flex", flexDirection: "column", overflow: "hidden", animationDelay: `${idx * 100}ms` }}>
                  
                  {/* Image Placeholder */}
                  <div style={{ 
                    height: "120px", 
                    width: "100%", 
                    background: `linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(168,85,247,0.15) 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                  }}>
                    <span style={{ fontSize: "3rem", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))" }}>🍽️</span>
                  </div>

                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h2 style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "1.3rem", fontWeight: 700, margin: 0, color: "#fff", flex: 1, paddingRight: "1rem", lineHeight: 1.3 }}>
                        {recipe.title}
                      </h2>
                      <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
                        <button 
                          onClick={() => startEdit(recipe)}
                          style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.2rem", transition: "color 0.2s" }}
                          onMouseOver={e => e.currentTarget.style.color = "#3b82f6"}
                          onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                          title="Edit"
                        >✏️</button>
                        <button 
                          onClick={() => handleDelete(recipe._id)}
                          style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.2rem", transition: "color 0.2s" }}
                          onMouseOver={e => e.currentTarget.style.color = "#ef4444"}
                          onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                          title="Delete"
                        >🗑️</button>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{
                        background: `${getDifficultyColor(recipe.difficulty)}22`,
                        color: getDifficultyColor(recipe.difficulty),
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase"
                      }}>
                        {recipe.difficulty}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>• ⏱️ {recipe.cookTime}</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>• 🍽️ {recipe.servings || "N/A"} Servings</span>
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.02)" }}>
                      <strong style={{ color: "#fb923c", display: "block", marginBottom: "0.4rem" }}>{recipe.ingredients.length} Ingredients:</strong>
                      <span style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{recipe.ingredients.join(", ")}</span>
                    </div>

                    <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
                      <details style={{ cursor: "pointer" }}>
                        <summary style={{ fontSize: "0.9rem", color: "#a855f7", fontWeight: 600, userSelect: "none" }}>View Instructions</summary>
                        <ol style={{ marginTop: "1rem", paddingLeft: "1.2rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
                          {recipe.steps.map((step, i) => <li key={i} style={{ marginBottom: "0.4rem" }}>{step}</li>)}
                        </ol>
                      </details>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
            
            {filteredAndSortedRecipes.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                No recipes found matching your search.
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
