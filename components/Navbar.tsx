"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "rgba(7, 8, 15, 0.7)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 1px 0 0 rgba(249, 115, 22, 0.2)", // subtle orange gradient effect line
      }}
    >
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
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link 
          href="/#recipe-form"
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #db2777 100%)",
            color: "#fff",
            padding: "0.4rem 1rem",
            borderRadius: "999px",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            boxShadow: "0 0 15px rgba(249,115,22,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(249,115,22,0.6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(249,115,22,0.4)";
          }}
        >
          <span>✨</span> Try AI
        </Link>
        <Link href="/" className="nav-link">
          Home
        </Link>
        {session ? (
          <>
            <Link href="/saved" className="nav-link">
              Saved Recipes
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "1rem", paddingLeft: "1rem", borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
              {/* Notification Bell */}
              <button 
                aria-label="Notifications"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.4rem",
                  transition: "color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
                onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  background: "#ef4444",
                  borderRadius: "50%",
                  border: "2px solid rgba(7, 8, 15, 1)"
                }}></span>
              </button>
              
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Hi, <span style={{ color: "#fff", fontWeight: 600 }}>{session.user?.name?.split(' ')[0]}</span>
              </span>
              <button 
                onClick={() => signOut()}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <div style={{ marginLeft: "1rem", paddingLeft: "1rem", borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
            <Link href="/login" style={{
              background: "#f97316",
              color: "#fff",
              textDecoration: "none",
              padding: "0.4rem 1rem",
              borderRadius: "0.5rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              transition: "filter 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.filter = "brightness(1)"}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
