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
      // Person — te dane czyta Google i modele językowe, i biorą je za deklarację
      // wprost. Dlatego stoi tu wyłącznie to, co ma pokrycie w portfolio: wcześniej
      // było "Java Developer" i Java na czele knowsAbout, przy zerowej liczbie
      // wydanych projektów w Javie. Java i Spring są w trakcie nauki i tam zostają.
      {
        "@type": "Person",
        "@id": `${baseUrl}/#author`,
        name: "Michał Pańczyk",
        alternateName: "sincore",
        url: baseUrl,
        jobTitle: "Specjalista ds. badań energetyczno-emisyjnych",
        knowsAbout: [
          "Energy and Emission Research",
          "Industrial Heating Systems",
          "PN-EN Standards",
          "Flue Gas Analysis",
          "Modbus RTU/TCP",
          "RS-485",
          "Industrial Measurement Instrumentation",
          "Python",
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
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
