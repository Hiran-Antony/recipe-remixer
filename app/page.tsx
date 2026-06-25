"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import LogoLoop from "@/components/LogoLoop";

const SoftAurora = dynamic(() => import("@/components/SoftAurora"), {
  ssr: false,
});

const cuisineLogos = [
  { node: <span style={{ display: "flex", alignItems: "center", gap: "2rem", color: "var(--text-muted)", fontSize: "1.1rem", fontWeight: 600, fontFamily: "var(--font-outfit)", letterSpacing: "0.1em", textTransform: "uppercase" }}><span>ITALIAN</span><span style={{color: "#f97316"}}>•</span></span>, title: "Italian" },
  { node: <span style={{ display: "flex", alignItems: "center", gap: "2rem", color: "var(--text-muted)", fontSize: "1.1rem", fontWeight: 600, fontFamily: "var(--font-outfit)", letterSpacing: "0.1em", textTransform: "uppercase" }}><span>INDIAN</span><span style={{color: "#f97316"}}>•</span></span>, title: "Indian" },
  { node: <span style={{ display: "flex", alignItems: "center", gap: "2rem", color: "var(--text-muted)", fontSize: "1.1rem", fontWeight: 600, fontFamily: "var(--font-outfit)", letterSpacing: "0.1em", textTransform: "uppercase" }}><span>CHINESE</span><span style={{color: "#f97316"}}>•</span></span>, title: "Chinese" },
  { node: <span style={{ display: "flex", alignItems: "center", gap: "2rem", color: "var(--text-muted)", fontSize: "1.1rem", fontWeight: 600, fontFamily: "var(--font-outfit)", letterSpacing: "0.1em", textTransform: "uppercase" }}><span>MEXICAN</span><span style={{color: "#f97316"}}>•</span></span>, title: "Mexican" },
  { node: <span style={{ display: "flex", alignItems: "center", gap: "2rem", color: "var(--text-muted)", fontSize: "1.1rem", fontWeight: 600, fontFamily: "var(--font-outfit)", letterSpacing: "0.1em", textTransform: "uppercase" }}><span>JAPANESE</span><span style={{color: "#f97316"}}>•</span></span>, title: "Japanese" },
  { node: <span style={{ display: "flex", alignItems: "center", gap: "2rem", color: "var(--text-muted)", fontSize: "1.1rem", fontWeight: 600, fontFamily: "var(--font-outfit)", letterSpacing: "0.1em", textTransform: "uppercase" }}><span>THAI</span><span style={{color: "#f97316"}}>•</span></span>, title: "Thai" },
];

/* ─── 150+ Categorized ingredient suggestions ─── */
const CATEGORIZED_SUGGESTIONS = [
  {
    category: "PROTEIN",
    color: "#f97316",
    items: ["Chicken","Eggs","Fish","Beef","Tofu","Shrimp","Paneer","Lamb","Pork","Turkey","Salmon","Tuna","Crab","Squid","Duck","Bacon","Sausage","Cottage Cheese","Lentils","Chickpeas","Sardines","Anchovies","Mussels","Halibut","Cod"],
  },
  {
    category: "VEGETABLES",
    color: "#22c55e",
    items: ["Broccoli","Tomatoes","Carrots","Onion","Spinach","Capsicum","Potato","Mushroom","Corn","Cauliflower","Zucchini","Eggplant","Peas","Cucumber","Cabbage","Kale","Celery","Asparagus","Beetroot","Sweet Potato","Green Beans","Leek","Bok Choy","Arugula","Radish","Turnip","Artichoke","Spring Onion","Pumpkin","Lotus Root"],
  },
  {
    category: "GRAINS & PASTA",
    color: "#eab308",
    items: ["Rice","Pasta","Noodles","Bread","Quinoa","Oats","Flour","Tortilla","Couscous","Barley","Bulgur","Bread Crumbs","Lasagna Sheets","Ramen","Udon","Soba","Polenta","Semolina","Rice Flour","Whole Wheat Flour"],
  },
  {
    category: "DAIRY",
    color: "#a855f7",
    items: ["Cheese","Butter","Milk","Cream","Yogurt","Mozzarella","Parmesan","Cheddar","Cream Cheese","Feta","Ricotta","Sour Cream","Condensed Milk","Ghee","Buttermilk","Brie","Gouda","Blue Cheese","Evaporated Milk"],
  },
  {
    category: "HERBS & SPICES",
    color: "#10b981",
    items: ["Garlic","Chili","Basil","Ginger","Cumin","Turmeric","Coriander","Oregano","Thyme","Rosemary","Paprika","Cardamom","Cloves","Cinnamon","Bay Leaf","Mint","Parsley","Dill","Fennel","Black Pepper","Chili Flakes","Star Anise","Nutmeg","Saffron","Lemongrass","Galangal","Curry Leaves","Kaffir Lime","Sumac","Za'atar"],
  },
  {
    category: "SAUCES & OILS",
    color: "#06b6d4",
    items: ["Olive Oil","Coconut Oil","Soy Sauce","Honey","Tomato Sauce","Vinegar","Fish Sauce","Sesame Oil","Hot Sauce","Worcestershire","Mustard","Ketchup","Mayo","Pesto","BBQ Sauce","Lemon Juice","Lime Juice","Tahini","Oyster Sauce","Hoisin Sauce","Sriracha","Miso Paste","Rice Vinegar","Coconut Milk","Tomato Paste"],
  },
  {
    category: "LEGUMES & NUTS",
    color: "#fb7185",
    items: ["Kidney Beans","Black Beans","Almonds","Peanuts","Cashews","Walnuts","Pumpkin Seeds","Sesame Seeds","Flax Seeds","Pine Nuts","Pecans","Pistachios","Edamame","Mung Beans","Split Peas","Sunflower Seeds","Hemp Seeds","Chia Seeds","Hazelnuts","Brazil Nuts"],
  },
  {
    category: "FRUITS",
    color: "#f472b6",
    items: ["Mango","Apple","Banana","Pineapple","Avocado","Strawberries","Blueberries","Lemon","Lime","Orange","Coconut","Dates","Figs","Grapes","Peach","Plum","Papaya","Pomegranate","Tamarind","Passion Fruit"],
  },
];

export default function HomePage() {
  const [ingredients, setIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalSaved, setTotalSaved] = useState<number | null>(null);
  const [openCats, setOpenCats] = useState<string[]>(["PROTEIN", "VEGETABLES"]);
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

  const addChip = (label: string) => {
    const clean = label.trim();
    const isExisting = currentIngredients.includes(clean.toLowerCase());
    const existingRaw = ingredients.split(",").map((s) => s.trim()).filter(Boolean);
    if (isExisting) {
      setIngredients(existingRaw.filter((s) => s.toLowerCase() !== clean.toLowerCase()).join(", "));
    } else {
      setIngredients([...existingRaw, clean].join(", "));
    }
  };

  const toggleCat = (cat: string) => {
    setOpenCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = ingredients.trim();
    if (!trimmed) {
      toast.error("Please add ingredients", { icon: "🥕" });
      return;
    }
    setIsGenerating(true);
    router.push(`/results?ingredients=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <SoftAurora speed={0.4} color1="#f97316" color2="#a855f7" noiseFrequency={2.0} bandHeight={0.6} />
      </div>

      {/* Floating Recipe Cards Background elements */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div className="glass-card orb-a" style={{ top: "10%", left: "5%", width: "120px", height: "160px", opacity: 0.1, transform: "rotate(-15deg)" }}></div>
        <div className="glass-card orb-b" style={{ bottom: "20%", right: "10%", width: "140px", height: "180px", opacity: 0.1, transform: "rotate(20deg)" }}></div>
      </div>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "clamp(3rem, 8vh, 6rem) 1rem 4rem",
        }}
      >
        {/* ── Hero section ── */}
        <section
          style={{
            width: "100%",
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
            textAlign: "center",
          }}
        >
          {/* Logo badge / Counter */}
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
            }}
          >
            <span style={{ fontSize: "1rem" }}>✨</span>
            <span style={{ fontWeight: 800 }}>{totalSaved !== null ? totalSaved : "0"}</span> Recipes in Your Collection
          </div>

          {/* Title */}
          <h1
            className="shimmer-text animate-fade-in-up delay-100"
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "clamp(2.6rem, 7vw, 4.8rem)",
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
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "rgba(209,213,219,0.85)",
              maxWidth: "520px",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Enter ingredients, get <span style={{ color: "#fb923c", fontWeight: 600 }}>AI recipes</span>. Transform your pantry into extraordinary meals in seconds.
          </p>

          {/* Feature Badges */}
          <div className="animate-fade-in-up delay-200" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
            <span style={{ background: "rgba(255,255,255,0.05)", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.8rem", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.1)" }}>⚡ AI Powered</span>
            <span style={{ background: "rgba(255,255,255,0.05)", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.8rem", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.1)" }}>🔒 Save Forever</span>
            <span style={{ background: "rgba(255,255,255,0.05)", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.8rem", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.1)" }}>👨‍🍳 Pro Recipes</span>
          </div>

          {/* ── Glass card / form ── */}
          <div
            className="glass-card animate-fade-in-up delay-300"
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "clamp(1.25rem, 3vw, 2rem)",
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
            }}
          >
            <form
              id="recipe-form"
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
              aria-label="Recipe search form"
            >
              <label
                htmlFor="ingredients-input"
                style={{
                  textAlign: "left",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "rgba(243,244,246,0.9)",
                }}
              >
                What's in your kitchen?
              </label>

              <textarea
                id="ingredients-input"
                className="recipe-input"
                rows={2}
                placeholder="e.g. chicken, garlic, tomatoes, basil…"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                style={{ resize: "vertical", minHeight: "64px", fontSize: "1.1rem" }}
              />

              <button
                id="find-recipes-btn"
                type="submit"
                disabled={isGenerating}
                className="btn-primary"
                style={{ padding: "1.25rem", fontSize: "1.15rem", marginTop: "0.5rem" }}
              >
                {isGenerating ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <span className="animate-spin" style={{ fontSize: "1.2rem", display: "inline-block" }}>🍳</span>
                    Cooking up ideas...
                  </span>
                ) : (
                  <>
                    <span style={{ fontSize: "1.2rem" }}>🍳</span>
                    Generate AI Recipes
                  </>
                )}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "18px", opacity: currentIngredients.length > 0 ? 1 : 0, transition: "opacity 0.2s ease" }}>
              <span style={{ fontSize: "0.8rem", color: "#fb923c", fontWeight: 600 }}>{currentIngredients.length} selected</span>
              <button type="button" onClick={() => setIngredients("")} style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Clear all</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {CATEGORIZED_SUGGESTIONS.map((cat) => {
                const isOpen = openCats.includes(cat.category);
                const selectedCount = cat.items.filter(item => currentIngredients.includes(item.toLowerCase())).length;
                return (
                  <div key={cat.category} style={{ borderRadius: "0.6rem", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}>
                    <button
                      type="button"
                      onClick={() => toggleCat(cat.category)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 1rem", background: "none", border: "none", cursor: "pointer", color: cat.color }}
                    >
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {cat.category}
                        {selectedCount > 0 && <span style={{ marginLeft: "0.5rem", background: cat.color + "33", color: cat.color, borderRadius: "99px", padding: "0.1rem 0.5rem", fontSize: "0.65rem" }}>{selectedCount}</span>}
                      </span>
                      <span style={{ fontSize: "0.6rem", opacity: 0.5, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                    </button>
                    {isOpen && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", padding: "0 1rem 0.8rem" }}>
                        {cat.items.map((item) => {
                          const active = currentIngredients.includes(item.toLowerCase());
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => addChip(item)}
                              className="ingredient-chip"
                              style={{
                                padding: "0.3rem 0.7rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: 500,
                                border: `1px solid ${active ? cat.color + "66" : "rgba(255,255,255,0.1)"}`,
                                background: active ? cat.color + "22" : "rgba(255,255,255,0.04)",
                                color: active ? cat.color : "rgba(209,213,219,0.8)", cursor: "pointer", transition: "all 0.2s ease"
                              }}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Marquee Section ── */}
        <section className="animate-fade-in-up delay-400" style={{ width: "100%", overflow: "hidden", marginTop: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "1rem 0", background: "rgba(0,0,0,0.2)" }}>
          <LogoLoop
            logos={cuisineLogos}
            speed={40}
            direction="left"
            logoHeight={24}
            gap={32}
            pauseOnHover={true}
            fadeOut={true}
            fadeOutColor="rgba(0,0,0,0.2)"
            ariaLabel="Cuisines"
          />
        </section>


        {/* ── How It Works Section ── */}
        <section className="animate-fade-in-up delay-500" style={{ width: "100%", maxWidth: "1000px", marginTop: "6rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-outfit)", marginBottom: "3rem" }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", position: "relative" }}>
            
            <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>🥕</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>1. Add Ingredients</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>Tell us what you have in your fridge and pantry.</p>
            </div>

            <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>🤖</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>2. AI Generates</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>Our culinary AI crafts unique, delicious recipes.</p>
            </div>

            <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>❤️</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>3. Cook & Save</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>Enjoy your meal and save the recipe for later.</p>
            </div>

          </div>
        </section>

      </main>
    </>
  );
}
