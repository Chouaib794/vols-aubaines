import Head from "next/head";
import Link from "next/link";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Flynino — Sign in</title>
        <meta
          name="description"
          content="Sign in to your Flynino account to manage alerts and trips."
        />
      </Head>

      <main
        style={{
          maxWidth: "420px",
          margin: "60px auto",
          padding: "24px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,0,0,.08)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#0b3061" }}>Sign in</h1>

        <p style={{ textAlign: "center", color: "#64748b" }}>
          Access your flight alerts and favorite deals.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "grid", gap: "14px", marginTop: "24px" }}
        >
          <label style={{ fontWeight: 600, color: "#334155" }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "10px 12px",
            }}
          />

          <label style={{ fontWeight: 600, color: "#334155" }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "10px 12px",
            }}
          />

          <button
            type="submit"
            style={{
              background: "#0b3061",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 14px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            Sign in
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <small>
            Don’t have an account?{" "}
            <Link href="/" style={{ color: "#0ea5e9", fontWeight: 600 }}>
              Sign up
            </Link>
          </small>
        </div>
      </main>
    </>
  );
}
