/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

const FORM_ENDPOINT = "https://formspree.io/f/xblzdjpl";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("_subject", "Nouvelle inscription aux alertes de prix — Flynino");
    data.append("_gotcha", "");
    try {
      const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: data });
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
    <>
      <Head>
        <title>Flynino — Aubaines de vols depuis Montréal</title>
        <meta name="description" content="Alertes de prix et aubaines de vols (Europe & Soleil) — Flynino." />
        <meta property="og:title" content="Flynino — Aubaines de vols" />
        <meta property="og:description" content="Trouve des aubaines de vols sans effort. Inscris-toi gratuitement." />
        <meta property="og:type" content="website" />
      </Head>

      <main className="page">
        {/* HEADER */}
        <header className="header">
          <div className="container header__inner">
            <div className="brand">
              <img className="brand__logo" src="/logo.jpg" alt="Logo Flynino" width={64} height={64} />
              <div className="brand__text">
                <span className="brand__title">FLYNINO</span>
                <span className="brand__tagline">fly cheap, flynino</span>
              </div>
            </div>

            <nav className="nav">
              <Link href="/deals" className="nav__link">Aubaines</Link>
              <a href="#subscribe" className="nav__link">S’abonner</a>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="container">
            <h1 className="hero__title">
              Trouve des <span className="accent">aubaines de vols</span> sans effort
            </h1>
            <p className="hero__lead">
              &quot;fly cheap, flynino&quot; — Alertes intelligentes pour les meilleures offres (Europe &amp; Soleil).
            </p>
            <Link href="/deals" className="btn btn--primary">Voir les aubaines →</Link>
          </div>
        </section>

        {/* FORM */}
        <section id="subscribe" className="container subscribe">
          <div className="card">
            <form onSubmit={onSubmit}>
              <label className="label">S’abonner aux alertes de prix</label>
              <div className="grid">
                <input name="email" type="email" required placeholder="votre@email.com" className="input" />
                <div className="grid grid--2">
                  <input name="origin" placeholder="Origine (ex. YUL)" className="input" />
                  <input name="dest" placeholder="Destination (ex. CDG)" className="input" />
                </div>
                <button type="submit" disabled={status === "sending"} className="btn btn--dark">
                  {status === "sending" ? "Envoi..." : "S’abonner"}
                </button>
                {status !== "idle" && (
                  <small className={status === "ok" ? "msg ok" : "msg err"}>{message}</small>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container">
            © {new Date().getFullYear()} Flynino — fly cheap, flynino
          </div>
        </footer>
      </main>

      {/* Styles minimalistes & pro */}
      <style jsx global>{`
        :root{
          --ink:#0f172a; --muted:#64748b; --bdr:#e5e7eb; --bg:#f6f9fc; --accent:#0ea5e9;
        }
        *{box-sizing:border-box}
        html,body{padding:0;margin:0}
        body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:var(--bg);}
        .container{max-width:1000px;margin:0 auto;padding:0 20px}
        .page{min-height:100vh;display:flex;flex-direction:column}
        .header{background:#fff;border-bottom:1px solid var(--bdr);position:sticky;top:0;z-index:20}
        .header__inner{display:flex;align-items:center;justify-content:space-between;padding:12px 0}
        .brand{display:flex;align-items:center;gap:12px}
        .brand__logo{border-radius:10px;box-shadow:0 2px 8px rgba(2,6,23,.08)}
        .brand__title{font-weight:900;letter-spacing:.5px;font-size:22px}
        .brand__tagline{font-size:12px;color:var(--muted);text-transform:uppercase}
        .nav{display:flex;gap:18px}
        .nav__link{color:#334155;text-decoration:none}
        .nav__link:hover{color:var(--accent)}
        .hero{padding:42px 0 16px;background:linear-gradient(0deg,rgba(14,165,233,.06),transparent)}
        .hero__title{font-size:36px;line-height:1.15;margin:0 0 8px}
        .accent{color:var(--accent);font-weight:800}
        .hero__lead{color:#475569;margin:8px 0 14px}
        .btn{display:inline-block;border-radius:10px;padding:10px 14px;font-weight:700;text-decoration:none}
        .btn--primary{background:var(--accent);color:#fff}
        .btn--primary:hover{filter:brightness(.95)}
        .btn--dark{background:var(--ink);color:#fff;border:1px solid var(--ink)}
        .card{background:#fff;border:1px solid var(--bdr);border-radius:14px;box-shadow:0 8px 30px rgba(2,6,23,.06);padding:16px}
        .label{font-weight:700;margin-bottom:8px;display:block}
        .grid{display:grid;gap:10px}
        .grid--2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        @media (max-width:640px){.grid--2{grid-template-columns:1fr}}
        .input{border:1px solid #d1d5db;border-radius:10px;padding:12px;background:#fff;width:100%}
        .footer{border-top:1px solid var(--bdr);background:#fff;margin-top:auto}
        .footer .container{padding:14px 20px;color:var(--muted);font-size:12px}
        .msg{font-size:13px}
        .msg.ok{color:#065f46}
        .msg.err{color:#7f1d1d}
      `}</style>
    </>
  );
}
