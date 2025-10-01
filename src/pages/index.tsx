import { useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import LanguageSwitcher from "../components/LanguageSwitcher";

const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_USE_LOCAL === "1"
    ? "/api/subscribe"
    : "https://formspree.io/f/xblzdjpl";

type Status = "idle" | "sending" | "ok" | "error";
type TripType = "round" | "oneway";

export default function Home() {
  const { t, lang } = useTranslation("home");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState("YUL");
  const [dest, setDest] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  const [tripType, setTripType] = useState<TripType>("round");
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState<
    "economy" | "premium" | "business" | "first"
  >("economy");
  const router = useRouter();

  const isSending = status === "sending";
  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );
  const isIata = (s: string) => /^[A-Z]{3}$/.test(s.trim().toUpperCase());

  function validateEmail() {
    if (!isEmailValid) {
      setEmailError(t("invalid_email"));
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
      setMessage(t("fix_fields"));
      return;
    }
    try {
      setStatus("sending");
      setMessage("");
      const data = new FormData();
      data.append("email", email.trim());
      data.append("origin", origin.trim().toUpperCase());
      data.append("dest", dest.trim().toUpperCase());
      data.append("_subject", "Nouvelle inscription — Flynino");
      data.append("_gotcha", "");

      const r = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!r.ok) throw new Error(String(r.status));

      setStatus("ok");
      setMessage(t("success"));
      setEmail("");
      liveRef.current?.focus();
    } catch {
      setStatus("error");
      setMessage(t("retry"));
      liveRef.current?.focus();
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const o = origin.trim().toUpperCase();
    const d = dest.trim().toUpperCase();
    if (!isIata(o) || !isIata(d)) {
      alert(t("invalid_iata"));
      return;
    }
    if (!depart) {
      alert(t("missing_depart"));
      return;
    }
    if (tripType === "round" && !ret) {
      alert(t("missing_return"));
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
        <title>Flynino — {t("title")}</title>
        <meta
          name="description"
          content="Alertes de prix et aubaines de vols — Flynino."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="page">
        {/* ===== HEADER ===== */}
        <header className="fh-header">
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

              {/* Bouton Sign in */}
              <Link
                href="/signin"
                className="fh-btn-signin"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#0ea5e9",
                  border: "none",
                  color: "#fff",
                  borderRadius: 9999,
                  padding: "6px 16px",
                  fontWeight: 700,
                  textDecoration: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                Sign in
              </Link>

              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* ===== HERO ===== */}
        <section className="hero">
          <div className="container hero__inner">
            <h1 className="hero__title">{t("title")}</h1>
            <p className="hero__lead">{t("subtitle")}</p>
          </div>
        </section>

        {/* ===== SUBSCRIBE ===== */}
        <section id="subscribe" className="container section">
          <div ref={liveRef} tabIndex={-1} aria-live="polite" />
          <div className="card">
            <form onSubmit={onSubmit} noValidate>
              <label className="label" htmlFor="email">
                {t("subscribe")}
              </label>
              <div className="grid">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className={`input ${emailError ? "input--err" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <small className="msg err">{emailError}</small>}

                <div className="grid grid--2">
                  <input
                    name="origin"
                    placeholder="Origine (YUL)"
                    className="input"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    maxLength={3}
                  />
                  <input
                    name="dest"
                    placeholder="Destination (CDG)"
                    className="input"
                    value={dest}
                    onChange={(e) => setDest(e.target.value)}
                    maxLength={3}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSending}
                  className="btn btn--dark"
                >
                  {isSending ? "Envoi..." : t("subscribe")}
                </button>
                {status !== "idle" && (
                  <div
                    role="status"
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

      {/* ===== STYLES ===== */}
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
        body {
          font-family: Inter, sans-serif;
          background: var(--bg);
          color: var(--ink);
        }
        .fh-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
        }
        .fh-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #fff;
        }
        .fh-logo {
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </>
  );
}
