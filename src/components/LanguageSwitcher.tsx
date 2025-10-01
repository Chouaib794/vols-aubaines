import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, locales, pathname, query, asPath } = router;

  // Sélectionne la langue opposée (fr -> en, en -> fr)
  const nextLocale = locale === "fr" ? "en" : "fr";

  function switchLanguage() {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
  }

  return (
    <button
      onClick={switchLanguage}
      style={{
        background: "transparent",
        border: "1px solid rgba(255,255,255,.7)",
        borderRadius: "8px",
        padding: "6px 12px",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      {locale === "fr" ? "EN 🇬🇧" : "FR 🇫🇷"}
    </button>
  );
}
