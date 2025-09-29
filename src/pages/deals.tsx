/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useState } from "react";

type Deal = { id:string; city:string; iata:string; month:number; price:number; link:string; };
const MOCK: Deal[] = [
  { id:"1", city:"Lisbonne",   iata:"LIS", month:11, price:553, link:"#"},
  { id:"2", city:"Las Vegas",  iata:"LAS", month: 1, price:281, link:"#"},
  { id:"3", city:"Paris",      iata:"CDG", month: 3, price:499, link:"#"},
  { id:"4", city:"Casablanca", iata:"CMN", month: 2, price:620, link:"#"},
];
const months = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];

export default function DealsPage() {
  const [minPrice, setMinPrice] = useState(150);
  const [maxPrice, setMaxPrice] = useState(1100);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);

  const data = useMemo(
    () => MOCK.filter(d => d.price >= minPrice && d.price <= maxPrice && (activeMonth ? d.month === activeMonth : true)),
    [minPrice, maxPrice, activeMonth]
  );

  return (
    <main className="deals">
      <div className="container">
        <h1 className="title">Aubaines au départ de Montréal</h1>

        {/* Filtres */}
        <section className="filters">
          <div className="months">
            {months.map((m, i) => {
              const num = i + 1, active = activeMonth === num;
              return (
                <button key={m} onClick={() => setActiveMonth(active ? null : num)}
                  className={`chip ${active ? "chip--on" : ""}`}>{m}</button>
              );
            })}
          </div>

          <div>
            <label className="label">Prix : {minPrice}$ – {maxPrice}$</label>
            <div className="ranges">
              <input type="range" min={100} max={1500} value={minPrice} onChange={e=>setMinPrice(Number(e.target.value))}/>
              <input type="range" min={100} max={1500} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}/>
            </div>
          </div>
        </section>

        {/* Liste */}
        <section className="grid">
          {data.map(d => (
            <a key={d.id} href={d.link} className="card">
              <div className="card__head">
                <strong className="card__city">{d.city}</strong>
                <span className="pill">{months[d.month-1]}</span>
              </div>
              <div className="muted">YUL → {d.iata}</div>
              <div className="card__price">{Math.round(d.price)} $</div>
              <div className="card__cta">Voir le deal →</div>
            </a>
          ))}
          {data.length === 0 && <div className="muted">Aucune aubaine pour ces filtres.</div>}
        </section>
      </div>

      <style jsx>{`
        :root{ --ink:#0f172a; --muted:#64748b; --bdr:#e5e7eb; --accent:#0ea5e9; }
        .deals{ font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; }
        .title{ font-size:32px; font-weight:800; margin:28px 0 10px }
        .filters{ display:grid; gap:12px; margin:6px 0 18px }
        .months{ display:flex; flex-wrap:wrap; gap:8px }
        .chip{ padding:6px 10px; border:1px solid var(--bdr); border-radius:999px; background:#fff; cursor:pointer }
        .chip--on{ background:var(--accent); color:#fff; border-color:var(--accent) }
        .label{ display:block; font-weight:600; margin-bottom:6px }
        .ranges{ display:flex; gap:12px; align-items:center }
        .grid{ display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); padding-bottom:28px }
        .card{ border:1px solid var(--bdr); border-radius:14px; padding:14px; text-decoration:none; color:var(--ink);
               background:#fff; box-shadow:0 8px 30px rgba(2,6,23,.05); transition:transform .12s ease, box-shadow .12s ease }
        .card:hover{ transform:translateY(-2px); box-shadow:0 14px 40px rgba(2,6,23,.08) }
        .card__head{ display:flex; justify-content:space-between; align-items:center }
        .card__city{ font-size:18px }
        .pill{ font-size:12px; border:1px solid var(--bdr); border-radius:999px; padding:2px 8px; color:#111827 }
        .muted{ color:var(--muted); font-size:13px; margin-top:4px }
        .card__price{ font-weight:800; font-size:24px; margin-top:8px }
        .card__cta{ margin-top:8px; font-size:14px; color:var(--accent) }
      `}</style>
    </main>
  );
}
