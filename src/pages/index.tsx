import type { NextPage } from "next";
import { useState } from "react";

// ⬇️ Mets ici ton vrai endpoint Formspree
const FORM_ENDPOINT = "https://formspree.io/f/xblzdjpl"; // <-- remplace par le tien

const Home: NextPage = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("_subject", "Nouvelle inscription aux alertes de prix — Flynino");
    data.append("_gotcha", "");

    try {
      const r = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!r.ok) throw new Error(String(r.status));
      setStatus("ok");
      setMessage("Merci ! Vérifie ta boîte mail, ton inscription a bien été envoyée.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Oups, envoi impossible. Réessaie dans un instant.");
    }
  }

  return (
    <main style={{ fontFamily: "system-ui, -apple-system", background: "#f8fafc", minHeight: "100vh" }}>
      {/* HEADER */}
      <header style={{ borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#0ea5e9"
    width="22"
    height="22"
  >
    <path d="M2.5 19.5l19-7.5-19-7.5v5l10 2.5-10 2.5v5z" />
  </svg>
  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: 0.5 }}>FLYNINO</span>
  <span style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase" }}>
    fly cheap, flynino
  </span>
</div>
, flynino</span>
          </div>
          <nav style={{ fontSize: 14, color: "#334155" }}>
            <a href="#subscribe" style={{ textDecoration: "none", color: "#334155" }}>S’abonner</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 8px" }}>
        <h1 style={{ fontSize: 36, lineHeight: 1.15, margin: 0 }}>
          Trouve des <span style={{ color: "#0ea5e9", fontWeight: 800 }}>aubaines de vols</span> sans effort
        </h1>
        <p style={{ color: "#475569", marginTop: 10 }}>
          {"\"fly cheap, flynino\""} — Alertes intelligentes pour les meilleures offres (Europe & Soleil).
        </p>
      </section>

      {/* FORM */}
      <section id="subscribe" style={{ maxWidth: 960, margin: "12px auto 40px", padding: "0 20px" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, boxShadow: "0 6px 18px rgba(2,6,23,0.04)" }}>
          <form onSubmit={onSubmit}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>S’abonner aux alertes de prix</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
              <input
                name="email" type="email" required placeholder="votre@email.com"
                style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", background: "#fff" }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <input
                  name="origin" placeholder="Origine (ex. YUL)"
                  style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", background: "#fff" }}
                />
                <input
                  name="dest" placeholder="Destination (ex. CDG)"
                  style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", background: "#fff" }}
                />
              </div>
              <button
                type="submit" disabled={status === "sending"}
                style={{
                  background: "#0f172a", color: "white", border: "1px solid #0f172a",
                  borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer",
                  opacity: status === "sending" ? 0.7 : 1
                }}
              >
                {status === "sending" ? "Envoi..." : "S’abonner"}
              </button>
              {status !== "idle" && (
                <small style={{ color: status === "ok" ? "#065f46" : "#7f1d1d" }}>{message}</small>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #e5e7eb", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "14px 20px", fontSize: 12, color: "#64748b" }}>
          © {new Date().getFullYear()} Flynino — fly cheap, flynino
        </div>
      </footer>
    </main>
  );
};

export default Home;
