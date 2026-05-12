/**
 * Wstrzykuje JSON-LD do <head> strony.
 * JSON-LD to format danych strukturalnych rozumiany przez Google —
 * pomaga w wyświetlaniu rich results w wyszukiwarce (np. breadcrumbs, info o autorze).
 *
 * Ten komponent jest serwerowy (brak "use client") — dane trafiają do HTML przy SSG.
 */
export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sincore.io";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // WebSite — podstawowe info o serwisie
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "sincore",
        description:
          "Publiczne portfolio technologiczne — projekty, baza wiedzy, narzędzia.",
        inLanguage: ["pl", "en"],
      },
      // Person — info o autorze
      {
        "@type": "Person",
        "@id": `${baseUrl}/#author`,
        name: "sincore",
        url: baseUrl,
        jobTitle: "Backend Developer & Automation Engineer",
        knowsAbout: [
          "Backend Development",
          "Industrial Automation",
          "Cybersecurity",
          "Modbus",
          "Siemens S7",
          "Python",
          "Next.js",
        ],
        sameAs: [
          "https://github.com/PanMimir",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
