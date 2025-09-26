import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
        Aubaines de vols — Montréal
      </h1>
      <p style={{ color: "#444" }}>
        Prototype prêt ✅ — ce site affichera bientôt les meilleures offres YUL → Europe & Soleil.
      </p>
    </main>
  );
};

export default Home;
