/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useState } from "react";


type Deal = {
  id: string;
  city: string;
  iata: string;
  month: number; // 1..12
  price: number; // CAD
  link: string; // (affilié plus tard)
};

const MOCK: Deal[] = [
  { id: "1", city: "Lisbonne", iata: "LIS", month: 11, price: 553, link: "#" },
  { id: "2", city: "Las Vegas", iata: "LAS", month: 1, price: 281, link: "#" },
  { id: "3", city: "Paris", iata: "CDG", month: 3, price: 499, link: "#" },
  { id: "4", city: "Casablanca", iata: "CMN", month: 2, price: 620, link: "#" },
];

const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

export default function DealsPage() {
  const [minPrice, setMinPrice] = useState(150);
  const [maxPrice, setMaxPrice] = useState(1100);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);

  const data = useMemo(() => {
    return MOCK.filter(
      (d) =>
        d.price >= minPrice &&
        d.price <= maxPrice &&
        (activeMonth ? d.month === activeMonth : true)
    );
  }, [minPrice, maxPrice, activeMonth]);

  return (
    <main
      style={{
        fontFamily: "system-ui,-apple-system",
        maxWidth: 1000,
        margin: "32px auto",
        padding: "0 16px",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
        Aubaines au départ de Montréal (mock)
      </h1>

      {/* Filtres */}
      <section
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "1fr",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {months.map((m, i) => {
            const monthNum = i + 1;
            const active = activeMonth === monthNum;
            return (
              <button
                key={m}
                onClick={() => setActiveMonth(active ? null : monthNum)}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: active ? "#0ea5e9" : "#fff",
                  color: active ? "#fff" : "#111827",
                }}
              >
                {m}
              </button>
            );
          })}
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Prix : {minPrice}$ – {maxPrice}$
          </label>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              type="range"
              min={100}
              max={1500}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
            <input
              type="range"
              min={100}
              max={1500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* Liste */}
      <section
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {data.map((d) => (
          <a
            key={d.id}
            href={d.link}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong style={{ fontSize: 18 }}>{d.city}</strong>
              <div
                style={{
                  fontSize: 12,
                  border: "1px solid #e5e7eb",
                  borderRadius: 999,
                  padding: "2px 8px",
                }}
              >
                {months[d.month - 1]}
              </div>
            </div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
              YUL → {d.iata}
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 24,
                marginTop: 8,
              }}
            >
              {Math.round(d.price)} $
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                color: "#0ea5e9",
              }}
            >
              Voir le deal →
            </div>
          </a>
        ))}
        {data.length === 0 && (
          <div style={{ color: "#6b7280" }}>Aucune aubaine pour ces filtres.</div>
        )}
      </section>
    </main>
  );
}
