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
        background: "rgba(7, 8, 15, 0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
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
        <Link href="/" className="nav-link">
          Home
        </Link>
        {session ? (
          <>
            <Link href="/saved" className="nav-link">
              Saved Recipes
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "1rem", paddingLeft: "1rem", borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
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
