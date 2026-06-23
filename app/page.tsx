"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const SoftAurora = dynamic(() => import("@/components/SoftAurora"), {
  ssr: false,
});

/* ─── Categorized ingredient suggestions ─── */
const CATEGORIZED_SUGGESTIONS = [
  {
    category: "🥩 Protein",
    items: ["🍗 Chicken", "🥚 Eggs", "🐟 Fish", "🥩 Beef", "🧊 Tofu", "🍤 Shrimp", "🧀 Paneer"]
  },
  {
    category: "🥦 Vegetables",
    items: ["🥦 Broccoli", "🍅 Tomatoes", "🥕 Carrots", "🧅 Onion", "🥬 Spinach", "🫑 Capsicum", "🥔 Potato", "🍄 Mushroom", "🌽 Corn"]
  },
  {
    category: "🧄 Flavours",
    items: ["🧄 Garlic", "🌶️ Chili", "🌿 Basil", "🫚 Ginger", "🌱 Cumin", "🏵️ Turmeric", "🌿 Coriander"]
  },
  {
    category: "🧀 Dairy",
    items: ["🧀 Cheese", "🧈 Butter", "🥛 Milk", "🍦 Cream", "🥣 Yogurt"]
  },
  {
    category: "🫒 Oils & Others",
    items: ["🫒 Olive oil", "🍋 Lemon", "🥥 Coconut oil", "🧉 Soy sauce", "🍯 Honey"]
  }
];

/* ─── Feature highlight cards ─── */
const FEATURES = [
  {
    icon: "✨",
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
    title: "AI-Powered",
    desc: "Smart recipes crafted from whatever you have on hand.",
  },
  {
    icon: "⚡",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    title: "Instant Results",
    desc: "Get multiple recipe ideas in seconds, not hours.",
  },
  {
    icon: "🍽️",
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.10)",
    title: "Any Cuisine",
    desc: "Italian, Asian, Mexican — explore the world on your plate.",
  },
];

export default function HomePage() {
  const [ingredients, setIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalSaved, setTotalSaved] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setTotalSaved(data.data.length);
        }
      })
      .catch(console.error);
  }, []);

  const currentIngredients = ingredients
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  /* Add or remove a quick-pick chip from the textarea */
  const addChip = (label: string) => {
    const clean = label.replace(/^\S+\s/, ""); // strip emoji
    const isExisting = currentIngredients.includes(clean.toLowerCase());

    const existingRaw = ingredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (isExisting) {
      // Remove it
      const newIngredients = existingRaw.filter(
        (s) => s.toLowerCase() !== clean.toLowerCase()
      );
      setIngredients(newIngredients.join(", "));
    } else {
      // Add it
      setIngredients([...existingRaw, clean].join(", "));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = ingredients.trim();
    if (!trimmed) return;
    setIsGenerating(true);
    router.push(`/results?ingredients=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <SoftAurora
          speed={0.4}
          color1="#f97316"
          color2="#a855f7"
          noiseFrequency={2.0}
          bandHeight={0.6}
        />
      </div>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "clamp(4rem, 10vh, 8rem) 1rem 4rem",
        }}
      >
        {/* ── Hero section ── */}
        <section
          style={{
            width: "100%",
            maxWidth: "680px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
            textAlign: "center",
          }}
        >
          {/* Logo badge */}
          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              background: "rgba(249,115,22,0.12)",
              border: "1px solid rgba(249,115,22,0.25)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#fb923c",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ fontSize: "1rem" }}>🔥</span>
            AI-Powered Cooking
          </div>

          {/* Title */}
          <h1
            className="shimmer-text animate-fade-in-up delay-100"
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "clamp(2.6rem, 7vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Recipe Remixer
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up delay-200"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              color: "rgba(209,213,219,0.75)",
              maxWidth: "480px",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Enter ingredients, get&nbsp;
            <span style={{ color: "#fb923c", fontWeight: 600 }}>AI recipes</span>
            . Transform your pantry into extraordinary meals in seconds.
          </p>

          {/* Total generated count */}
          {totalSaved !== null && (
            <div className="animate-fade-in-up delay-200" style={{ marginTop: "-0.5rem", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Join others who have saved <span style={{ color: "#a855f7", fontWeight: 700 }}>{totalSaved}</span> recipes!
            </div>
          )}

          {/* ── Glass card / form ── */}
          <div
            className="glass-card animate-fade-in-up delay-300"
            style={{
              width: "100%",
              marginTop: "0.75rem",
              padding: "clamp(1.5rem, 4vw, 2.25rem)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <form
              id="recipe-form"
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              aria-label="Recipe search form"
            >
              {/* Label */}
              <label
                htmlFor="ingredients-input"
                style={{
                  textAlign: "left",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "rgba(243,244,246,0.85)",
                  letterSpacing: "0.01em",
                }}
              >
                What&apos;s in your kitchen?
              </label>

              {/* Textarea */}
              <textarea
                id="ingredients-input"
                className="recipe-input"
                rows={3}
                placeholder="e.g. chicken, garlic, tomatoes, basil…"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                aria-describedby="ingredients-hint"
                style={{ resize: "vertical", minHeight: "88px" }}
              />

              <p
                id="ingredients-hint"
                style={{
                  margin: 0,
                  marginTop: "-0.5rem",
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  textAlign: "left",
                }}
              >
                Separate ingredients with commas or just type naturally.
              </p>

              {/* CTA button */}
              <button
                id="find-recipes-btn"
                type="submit"
                disabled={isGenerating}
                className="btn-primary"
                aria-label="Find recipes based on your ingredients"
              >
                {isGenerating ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <span className="animate-spin" style={{ fontSize: "1.1rem", display: "inline-block" }}>🍳</span>
                    Cooking up ideas...
                  </span>
                ) : (
                  <>
                    <span style={{ fontSize: "1.1rem" }}>🍳</span>
                    Find Recipes
                  </>
                )}
              </button>
            </form>

            {/* Quick-pick chips */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {CATEGORIZED_SUGGESTIONS.map((cat) => (
                <div key={cat.category} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                      textAlign: "left",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {cat.category}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                    role="list"
                    aria-label={`Suggested ${cat.category}`}
                  >
                    {cat.items.map((s) => {
                      const clean = s.replace(/^\S+\s/, "");
                      const active = currentIngredients.includes(clean.toLowerCase());
                      return (
                        <button
                          key={s}
                          type="button"
                          role="listitem"
                          onClick={() => addChip(s)}
                          className="chip"
                          aria-pressed={active}
                          style={
                            active
                              ? {
                                  background: "rgba(249,115,22,0.15)",
                                  borderColor: "rgba(249,115,22,0.4)",
                                  color: "#fb923c",
                                }
                              : undefined
                          }
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Feature highlight cards ── */}
          <div
            className="animate-fade-in-up delay-400"
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.875rem",
              marginTop: "0.5rem",
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-card"
                style={{
                  padding: "1.1rem 1.15rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  textAlign: "left",
                }}
              >
                <div
                  className="feature-icon-box"
                  style={{ background: f.bg, color: f.color }}
                  aria-hidden="true"
                >
                  {f.icon}
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    {f.title}
                  </p>
                  <p
                    style={{
                      margin: "0.2rem 0 0",
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.45,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p
            className="animate-fade-in-up delay-500"
            style={{
              marginTop: "1rem",
              fontSize: "0.78rem",
              color: "rgba(107,114,128,0.8)",
            }}
          >
            ✨ Powered by AI — no sign-up required
          </p>
        </section>
      </main>
    </>
  );
}
