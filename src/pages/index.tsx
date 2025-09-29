/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import Link from "next/link";

const FORM_ENDPOINT = "https://formspree.io/f/xblzdjpl"; // ton endpoint Formspree

export default function Home() {
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
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Logo */}
            <img src="/logo.jpg" alt="Logo Flynino" width={70} height={70} style={{ borderRadius: 8 }} />

            {/* Texte */}
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: 0.5 }}>FLYNINO</span>
              <span style={{ fontSize: 13, color: "#64748b", textTransform: "uppercase" }}>
                fly cheap, flynino
              </span>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav style={{ fontSize: 14, color: "#334155", display: "flex", gap: 16 }}>
            <Link href="/deals" style={{ textDecoration: "none", color: "#334155" }}>
              Aubaines
            </Link>
            <a href="#subscribe" style={{ textDecoration: "none", color: "#334155" }}>
              S’abonner
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 8px" }}>
        <h1 style={{ fontSize: 36, lineHeight: 1.15, margin: 0 }}>
          Trouve des <span style={{ color: "#0ea5e9", fontWeight: 800 }}>aubaines de vols</span> sans effort
        </h1>
        <p style={{ color: "#475569", marginTop: 10 }}>
          &quot;fly cheap, flynino&quot; — Alertes intelligentes pour les meilleures offres (Europe &amp; Soleil).
        </p>

        <Link
          href="/deals"
          style={{
            display: "inline-block",
