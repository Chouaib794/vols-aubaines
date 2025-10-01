import { useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_USE_LOCAL === "1"
    ? "/api/subscribe"
    : "https://formspree.io/f/xblzdjpl";

type Status = "idle" | "sending" | "ok" | "error";
type TripType = "round" | "oneway";
type Cabin = "economy" | "premium" | "business" | "first";

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState("YUL");
  const [dest, setDest] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  // Search bar
  const [tripType, setTripType] = useState<TripType>("round");
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState<Cabin>("economy");
  const router = useRouter();

  const isSending = status === "sending";
  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );
  const isIata = (s: string) => /^[A-Z]{3}$/.test(s.trim());

  const todayISO = new Date().toISOString().slice(0, 10);
  const retMin = depart && tripType === "round" ? depart : todayISO;

  function validateEmail() {
    if (!isEmailValid) {
      setEmailError("Adresse e-mail invalide.");
      return false;
    }
    setEmailError(null);
    return true;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSending) return;
    if (!validateEmail()) {
      setStatus("error");
      setMessage("Merci de corriger les champs en rouge.");
      return;
    }
    try {
      setStatus("sending");
      setMessage("");
      const data = new FormData();
      data.append("email", email.trim());
      data.append("origin", origin.trim().toUpperCase());
      data.append("dest", dest.trim().toUpperCase());
      data.append("_subject", "Nouvelle inscription aux alertes de prix — Flynino");
      data.append("_gotcha", "");

      const r = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!r.ok) throw new Error(String(r.status));

      setStatus("ok");
      setMessage("Merci ! Vérifie ta boîte mail, ton inscription a bien été envoyée.");
      setEmail("");
      liveRef.current?.focus();
    } catch {
      setStatus("error");
      setMessage("Oups, envoi impossible. Réessaie dans un instant.");
      liveRef.current?.focus();
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const o = origin.trim().toUpperCase();
    const d = dest.trim().toUpperCase();

    if (!isIata(o) || !isIata(d)) {
      alert("Utilise des codes IATA (ex: YUL, CDG).");
      return;
    }
    if (!depart) {
      alert("Ajoute une date de départ.");
      return;
    }
    if (tripType === "round" && !ret) {
      alert("Ajoute une date de retour ou passe en aller simple.");
      return;
    }
    if (tripType === "round" && ret < depart) {
      alert("La date de retour doit être après la date de départ.");
      return;
    }

    const q: Record<string, string> = {
      o,
      d,
      depart,
      trip: tripType,
      adults: String(adults),
      cabin,
    };
    if (tripType === "round") q.return = ret;

    router.push({ pathname: "/deals", query: q });
  }

  return (
    <>
      <Head>
        <title>Flynino — Aubaines de vols depuis Montréal</title>
        <meta
          name="description"
          content="Alertes de prix et aubaines de vols (Europe & Soleil) — Flynino."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="page">
        {/* ===== HEADER (Flights only) ===== */}
        <header className="fh-header">
          {/* Topbar */}
          <div className="container fh-topbar">
            <Link className="fh-brand" href="/" aria-label="Flynino — home">
              <img
                src="/logo.jpg"
                alt="Flynino"
                width={40}
                height={40}
                className="fh-logo"
              />
              <span className="fh-brand-text">Flynino</span>
            </Link>

            <div className="fh-actions">
              <Link href="/support" className="fh-link">
                Support
              </Link>
              <Link href="/trips" className="fh-link">
                My Trips
              </Link>
              <button
                type="button"
                className="fh-chip"
                aria-label="Change language and currency"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  className="icon"
                >
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2m1 17.93V16h3.07A8.03 8.03 0 0 1 13 19.93M8 14H5.05a7.98 7.98 0 0 1 0-4H8zm2 0V10h4v4zm6-4h2.95a7.98 7.98 0 0 1 0 4H16zM13 4.07V8h3.07A8.03 8.03 0 0 0 13 4.07M10.93 8H8V4.93A8.03 8.03 0 0 0 10.93 8M11 19.93A8.03 8.03 0 0 1 8 16h2.93z"
                  />
                </svg>
                CAD (En)
              </button>
              <Link href="/signin" className="fh-btn-signin">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  className="icon"
                >
                  <path
                    fill="currentColor"
                    d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5"
                  />
                </svg>
                Sign in
              </Link>
            </div>
          </div>

          {/* Onglet principal */}
          <div className="container fh-tabs-wrap">
            <nav className="fh-tabs" role="tablist" aria-label="Products">
              <Link href="/deals" className="fh-tab is-active">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  className="icon"
                >
                  <path
                    fill="currentColor"
                    d="M21 16v-2l-8-5V4a1 1 0 0 0-2 0v5L3 14v2l8-2z"
                  />
                </svg>
                Flights
              </Link>
            </nav>
          </div>
        </header>

        {/* ===== SEARCH BAR ===== */}
        <section className="search container">
          <form className="searchbar" onSubmit={handleSearch}>
            <div className="pill-group" role="tablist" aria-label="Trip type">
              <button
                type="button"
                className={`pill ${tripType === "round" ? "is-active" : ""}`}
                onClick={() => setTripType("round")}
                aria-pressed={tripType === "round"}
              >
                Round trip
              </button>
              <button
                type="button"
                className={`pill ${tripType === "oneway" ? "is-active" : ""}`}
                onClick={() => {
                  setTripType("oneway");
                  setRet("");
                }}
                aria-pressed={tripType === "oneway"}
              >
                One way
              </button>
            </div>

            <div className="row">
              <div className="field">
                <label htmlFor="from">From</label>
                <input
                  id="from"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="input"
                  placeholder="YUL"
                  aria-label="From airport (IATA)"
                  autoCapitalize="characters"
                />
              </div>
              <button
                type="button"
                className="swap"
                onClick={() => {
                  setOrigin(dest.toUpperCase());
                  setDest(origin.toUpperCase());
                }}
                aria-label="Swap origin and destination"
              >
                ↔
              </button>
              <div className="field">
                <label htmlFor="to">To</label>
                <input
                  id="to"
                  value={dest}
                  onChange={(e) => setDest(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="input"
                  placeholder="CDG"
                  aria-label="To airport (IATA)"
                  autoCapitalize="characters"
                />
              </div>
              <div className="field">
                <label htmlFor="depart">Depart</label>
                <input
                  id="depart"
                  type="date"
                  value={depart}
                  min={todayISO}
                  onChange={(e) => setDepart(e.target.value)}
                  className="input"
                />
              </div>
              {tripType === "round" && (
                <div className="field">
                  <label htmlFor="return">Return</label>
                  <input
                    id="return"
                    type="date"
                    value={ret}
                    min={retMin}
                    onChange={(e) => setRet(e.target.value)}
                    className="input"
                  />
                </div>
              )}
              <div className="field">
                <label htmlFor="pax">Passengers</label>
                <input
                  id="pax"
                  type="number"
                  min={1}
                  max={9}
                  value={adults}
                  onChange={(e) =>
                    setAdults(
                      Math.max(1, Math.min(9, Number(e.target.value) || 1))
                    )
                  }
                  className="input"
                />
              </div>
              <div className="field">
                <label htmlFor="cabin">Cabin</label>
                <select
                  id="cabin"
                  className="input"
                  value={cabin}
                  onChange={(e) => setCabin(e.target.value as Cabin)}
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </select>
              </div>
              <button className="btn btn--primary search-btn" type="submit">
                Search
              </button>
            </div>
          </form>
        </section>

        {/* ===== HERO (court) ===== */}
        <section className="hero">
          <div className="container hero__inner">
            <h1 className="hero__title">
              Trouve des <span className="accent">aubaines de vols</span> sans
              effort
            </h1>
            <p className="hero__lead">
              “fly cheap, flynino” — Alertes intelligentes pour les meilleures
              offres.
            </p>
          </div>
        </section>

        {/* ===== FORM subscribe ===== */}
        <section id="subscribe" className="container section">
          <div
            ref={liveRef}
            tabIndex={-1}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />
          <div className="card">
            <form onSubmit={onSubmit} noValidate>
              <label className="label" htmlFor="email">
                S’abonner aux alertes de prix
              </label>
              <div className="grid">
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="votre@email.com"
                    className={`input ${emailError ? "input--err" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                  />
                  {emailError && <small className="msg err">{emailError}</small>}
                </div>
                <div className="grid grid--2">
                  <input
                    name="origin"
                    placeholder="Origine (ex. YUL)"
                    className="input"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                    maxLength={3}
                    autoCapitalize="characters"
                  />
                  <input
                    name="dest"
                    placeholder="Destination (ex. CDG)"
                    className="input"
                    value={dest}
                    onChange={(e) => setDest(e.target.value.toUpperCase())}
                    maxLength={3}
                    autoCapitalize="characters"
                  />
                </div>
                <button type="submit" disabled={isSending} className="btn btn--dark">
                  {isSending ? "Envoi..." : "S’abonner"}
                </button>
                {status !== "idle" && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`notice ${
                      status === "ok" ? "notice--ok" : "notice--err"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="footer">
          <div className="container">
            © {new Date().getFullYear()} Flynino — fly cheap, flynino
          </div>
        </footer>
      </main>

      {/* ===== Styles ===== */}
      <style jsx global>{`
        :root {
          --ink: #0f172a;
          --muted: #64748b;
          --bdr: #e5e7eb;
          --bg: #f6f9fc;
          --accent: #0ea5e9;
          --ok: #065f46;
          --err: #7f1d1d;
        }
        * { box-sizing: border-box; }
        html, body { padding: 0; margin: 0; }
        body {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            Segoe UI, Roboto, Helvetica, Arial, sans-serif;
          color: var(--ink); background: var(--bg);
        }
        .container { max-width: 1060px; margin: 0 auto; padding: 0 20px; }
        .page { min-height: 100vh; display:flex; flex-direction:column; }
        .sr-only {
          position:absolute; width:1px; height:1px; padding:0; margin:-1px;
          overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
        }
        .fh-header{background:linear-gradient(180deg,#0b3061 0%, #0b3061 60%, rgba(11,48,97,.85) 100%);
          color:#fff; position:sticky; top:0; z-index:50; border-bottom:1px solid rgba(255,255,255,.08)}
        .fh-topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 0}
        .fh-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#fff}
        .fh-logo{border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,.15)}
        .fh-brand-text{font-weight:900;letter-spacing:.3px;font-size:20px}
        .fh-actions{display:flex;align-items:center;gap:18px}
        .fh-link{color:#cbd5e1;text-decoration:none;font-weight:600}
        .fh-link:hover{color:#fff;text-decoration:underline}
        .fh-chip{display:flex;align-items:center;gap:8px;background:transparent;border:1px solid rgba(255,255,255,.25);color:#e2e8f0;border-radius:9999px;padding:6px 10px;font-weight:700}
        .fh-chip:hover{background:rgba(255,255,255,.06)}
        .fh-btn-signin{display:flex;align-items:center;gap:8px;background:transparent;border:1px solid rgba(255,255,255,.7);color:#fff;border-radius:9999px;padding:6px 12px;font-weight:800;text-decoration:none}
        .fh-btn-signin:hover{background:rgba(255,255,255,.1)}
        .icon{display:inline-block;vertical-align:-2px}
        .fh-tabs-wrap{padding-bottom:10px}
        .fh-tabs{display:flex;gap:10px;flex-wrap:nowrap;overflow:auto;padding-bottom:6px}
        .fh-tab{display:inline-flex;align-items:center;gap:8px;background:transparent;border:1px solid rgba(255,255,255,.25);color:#e2e8f0;text-decoration:none;font-weight:800;border-radius:12px;padding:10px 12px;white-space:nowrap}
        .fh-tab:hover{background:rgba(255,255,255,.08);color:#fff}
        .fh-tab.is-active{background:#fff;color:#0b3061;border-color:#fff}
        .search{padding:14px 0}
        .searchbar{background:#fff;border:1px solid var(--bdr);border-radius:16px;box-shadow:0 10px 30px rgba(2,6,23,.08);padding:12px}
        .pill-group{display:inline-flex;background:#eef2f7;border-radius:9999px;padding:4px;margin-bottom:8px}
        .pill{border:0;background:transparent;padding:8px 12px;border-radius:9999px;font-weight:800;color:#475569;cursor:pointer}
        .pill.is-active{background:#0b3061;color:#fff}
        .row{display:grid;grid-template-columns:1.2fr auto 1.2fr 1fr 1fr .8fr 1fr auto;gap:10px}
        @media (max-width:980px){ .row{grid-template-columns:1fr 1fr 1fr 1fr;} .swap{order:9} .search-btn{grid-column:1 / -1}}
        .field{display:flex;flex-direction:column;gap:6px}
        .field label{font-size:12px;color:#334155;font-weight:700}
        .input{border:1px solid #d1d5db;border-radius:10px;padding:10px 12px;background:#fff;width:100%}
        .swap{align-self:end;border:1px dashed #94a3b8;background:#f8fafc;border-radius:10px;padding:10px 12px;cursor:pointer}
        .search-btn{align-self:end}
        .hero{padding:30px 0 8px}
        .hero__inner{display:grid;gap:8px}
        .hero__title{font-size:32px;line-height:1.2;margin:0}
        .accent{color:var(--accent);font-weight:800}
        .hero__lead{color:#475569;margin:6px 0 10px}
        .section{padding:18px 0 40px}
        .card{background:#fff;border:1px solid var(--bdr);border-radius:14px;box-shadow:0 8px 30px rgba(2,6,23,.06);padding:16px}
        .label{font-weight:700;margin-bottom:8px;display:block}
        .grid{display:grid;gap:10px}
        .grid--2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        @media (max-width:640px){.grid--2{grid-template-columns:1fr}}
        .input--err{border-color:#dc2626;outline-color:#dc2626}
        .btn{display:inline-block;border-radius:10px;padding:10px 14px;font-weight:700;text-decoration:none;transition:all .15s ease}
        .btn--primary{background:var(--accent);color:#fff}
        .btn--primary:hover{filter:brightness(.95);transform:translateY(-1px)}
        .btn--dark{background:#0f172a;color:#fff;border:1px solid #0f172a}
        .btn--dark:hover{filter:brightness(.95)}
        .btn--ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4)}
        .btn--ghost:hover{background:rgba(255,255,255,.08)}
        .notice{font-size:13px;padding:10px;border-radius:10px;border:1px solid}
        .notice--ok{color:var(--ok);border-color:#a7f3d0;background:#ecfdf5}
        .notice--err{color:var(--err);border-color:#fecaca;background:#fef2f2}
        .footer{border-top:1px solid var(--bdr);background:#fff;margin-top:auto}
        .footer .container{padding:14px 20px;color:var(--muted);font-size:12px}
      `}</style>
    </>
  );
}
