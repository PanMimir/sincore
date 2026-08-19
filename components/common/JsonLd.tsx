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
        jobTitle: "Java Developer",
        knowsAbout: [
          "Java",
          "Spring Framework",
          "Object-Oriented Programming",
          "SQL",
          "Git",
          "Energy and Emission Research",
          "Industrial Heating Systems",
          "PN-EN Standards",
        ],
        sameAs: [
          "https://github.com/PanMimir",
          "https://www.linkedin.com/in/michal-panczyk-mp01/",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escapujemy "<" → "<", żeby dane nie mogły wyjść z <script> przez "</script>"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
