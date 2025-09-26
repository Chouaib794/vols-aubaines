import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main style={{ fontFamily: "system-ui, -apple-system", padding: "24px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>
            Aubaines de vols — Montréal
          </h1>
          <p style={{ color: "#555", marginTop: 8 }}>
            Recevez les meilleures offres (YUL → Europe & Soleil) directement par courriel.
          </p>
        </header>

        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            background: "#fff",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const data = new FormData(form);
              const email = String(data.get("email") || "");
              const origin = String(data.get("origin") || "");
              const dest = String(data.get("dest") || "");
              alert(
                `OK! (factice pour l'instant)\nEmail: ${email}\nOrigine: ${origin}\nDestination: ${dest}`
              );
              form.reset();
            }}
          >
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
              S’abonner aux alertes de prix
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 8,
              }}
            >
              <input
                name="email"
                type="email"
                required
                placeholder="votre@email.com"
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <input
                  name="origin"
                  placeholder="Origine (ex. YUL)"
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                />
                <input
                  name="dest"
                  placeholder="Destination (ex. CDG)"
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: "black",
                  color: "white",
                  border: "1px solid black",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                S’abonner
              </button>
              <small style={{ color: "#6b7280" }}>
                * Démo : ce formulaire affiche une alerte. On le reliera à un vrai envoi email à l’étape suivante.
              </small>
            </div>
          </form>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Pourquoi s’abonner ?</h2>
          <ul style={{ color: "#444", lineHeight: 1.6 }}>
            <li>Alertes quand un prix tombe sous la moyenne.</li>
            <li>Focus sur Montréal (YUL) → Europe & Soleil.</li>
            <li>Fréquence raisonnable (pas de spam).</li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Home;



