/**
 * Wstrzykuje JSON-LD do <head> strony.
 * JSON-LD to format danych strukturalnych rozumiany przez Google —
 * pomaga w wyświetlaniu rich results w wyszukiwarce (np. breadcrumbs, info o autorze).
 *
 * Ten komponent jest serwerowy (brak "use client") — dane trafiają do HTML przy SSG.
 */
export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nullsec.dev";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // WebSite — podstawowe info o serwisie
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "nullSec",
        description:
          "Publiczne portfolio technologiczne — projekty, baza wiedzy, narzędzia.",
        inLanguage: ["pl", "en"],
      },
      // Person — info o autorze
      {
        "@type": "Person",
        "@id": `${baseUrl}/#author`,
        name: "nullSec",
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
          "https://github.com/yourusername", // zmień na swój URL
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
