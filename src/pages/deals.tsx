import { useRouter } from "next/router";
import Link from "next/link";

function gfDate(d?: string | string[]) {
  if (!d || typeof d !== "string") return "";
  // YYYY-MM-DD -> YYMMDD  (ex: 2028-07-01 => 280701)
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const [, y, mo, da] = m;
  return y.slice(2) + mo + da;
}


export default function Deals() {
  const { query } = useRouter();
  const { o, d, depart, trip, adults, cabin, return: ret } = query;

  // Construit un lien Google Flights pratique pour valider les paramètres
  const pax = Number(adults || 1);
  const cabins: Record<string, string> = { economy: "e", premium: "p", business: "b", first: "f" };
  const c = cabins[String(cabin || "economy")] ?? "e";
  const dep = gfDate(depart);
  const r = gfDate(ret);

  const base = "https://www.google.com/travel/flights";
  const gfl =
    trip === "oneway" || !r
      ? `${base}?q=${o}-${d}%20${dep};tt=o;px=${pax};c=${c}`
      : `${base}?q=${o}-${d}%20${dep}%20${r};tt=r;px=${pax};c=${c}`;

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      <Link href="/" style={{ textDecoration: "none", color: "#0ea5e9" }}>← Retour</Link>
      <h1 style={{ marginTop: 12 }}>Deals (demo)</h1>

      <p>Paramètres reçus :</p>
      <pre style={{ background: "#f7fafc", padding: 12, borderRadius: 8, border: "1px solid #e5e7eb", overflowX: "auto" }}>
{JSON.stringify({ o, d, depart, trip, adults, cabin, return: ret }, null, 2)}
      </pre>

      <p style={{ marginTop: 16 }}>
        <a href={gfl} target="_blank" rel="noreferrer"
           style={{ padding: "10px 14px", borderRadius: 10, background: "#0ea5e9", color: "#fff", textDecoration: "none", fontWeight: 700 }}>
          Ouvrir cette recherche dans Google Flights
        </a>
      </p>
    </main>
  );
}
