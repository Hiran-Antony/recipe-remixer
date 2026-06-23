"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const SoftAurora = dynamic(() => import("@/components/SoftAurora"), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isRegistering) {
      // Register
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (data.success) {
          // Login automatically
          const signInRes = await signIn("credentials", { email, password, redirect: false });
          if (signInRes?.error) {
            setError(signInRes.error);
          } else {
            router.push("/");
          }
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Something went wrong");
      }
    } else {
      // Login
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <SoftAurora speed={0.4} color1="#f97316" color2="#a855f7" noiseFrequency={2.0} bandHeight={0.6} />
      </div>

      <main style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="glass-card animate-fade-in-up" style={{ width: "100%", maxWidth: "400px", padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ textAlign: "center" }}>
            <h1 className="shimmer-text" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "2rem", margin: "0 0 0.5rem 0" }}>
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
              {isRegistering ? "Sign up to start saving recipes." : "Sign in to view your collection."}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#f87171", padding: "0.75rem", borderRadius: "0.5rem", fontSize: "0.85rem", textAlign: "center" }}>
                {error}
              </div>
            )}

            {isRegistering && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(243,244,246,0.85)" }}>Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="recipe-input"
                  style={{ minHeight: "auto", padding: "0.75rem 1rem" }}
                  placeholder="Chef John"
                />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(243,244,246,0.85)" }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="recipe-input"
                style={{ minHeight: "auto", padding: "0.75rem 1rem" }}
                placeholder="you@example.com"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(243,244,246,0.85)" }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="recipe-input"
                style={{ minHeight: "auto", padding: "0.75rem 1rem" }}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "0.5rem" }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="animate-spin" style={{ fontSize: "1.1rem" }}>🍳</span>
                  {isRegistering ? "Signing up..." : "Signing in..."}
                </span>
              ) : (
                isRegistering ? "Sign Up" : "Sign In"
              )}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              width: "100%",
              padding: "0.75rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "0.875rem",
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Continue with Google
          </button>

          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
            {isRegistering ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setError(""); }}
              style={{ background: "none", border: "none", color: "#f97316", fontWeight: 600, cursor: "pointer", padding: 0 }}
            >
              {isRegistering ? "Sign In" : "Sign Up"}
            </button>
          </p>

        </div>
      </main>
    </>
  );
}
