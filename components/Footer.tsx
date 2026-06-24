"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        background: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(10px)",
        padding: "3rem 2rem 2rem",
        marginTop: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        flexShrink: 0,
      }}
    >
      <div style={{ maxWidth: "1200px", width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "300px" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>Recipe Remixer</span>
            <span style={{ fontSize: "1.2rem" }}>🍳</span>
          </Link>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>
            Transform your pantry staples into culinary masterpieces with the power of AI. Your next favorite meal is just a click away.
          </p>
        </div>

        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h4 style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.5rem" }}>Platform</h4>
            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fb923c"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}>Generator</Link>
            <Link href="/saved" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fb923c"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}>Saved Recipes</Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h4 style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.5rem" }}>Legal</h4>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fb923c"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}>Privacy Policy</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fb923c"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}>Terms of Service</span>
          </div>
        </div>
      </div>

      <div style={{ 
        width: "100%", 
        maxWidth: "1200px", 
        borderTop: "1px solid rgba(255, 255, 255, 0.05)", 
        paddingTop: "2rem",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem"
      }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
          © {new Date().getFullYear()} Recipe Remixer. Made with ❤️ and AI.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          {/* Social Icons (SVG) */}
          <a href="#" aria-label="Twitter" style={{ color: "var(--text-muted)", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#1DA1F2"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
          </a>
          <a href="#" aria-label="GitHub" style={{ color: "var(--text-muted)", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
