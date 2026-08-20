import { ImageResponse } from "next/og";

// Kafelek pokazywany przy każdym udostępnionym linku (LinkedIn, Slack, Messenger).
// Paleta musi być ta sama co na stronie — wcześniej został tu fiolet z brandu v1,
// bo tego obrazka nie widać w przeglądarce i nikt go nie zaktualizował przy redesignie.

export const runtime = "edge";
export const alt = "sincore — It works. That's the point.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tokeny brandu v2 "silent industrial" — zgodne z app/globals.css
const BG = "#0B0D10"; // neutral-950
const SURFACE = "#1F2328"; // neutral-800
const TEXT = "#F2F4F7"; // neutral-100
const MUTED = "#7D858F"; // --text-muted
const ACCENT = "#00BFEF"; // accent-500
const ACCENT_SOFT = "#5EE0FF"; // accent-300

const TAGLINE: Record<string, string> = {
  pl: "oprogramowanie · automatyzacja · integracje przemysłowe",
  en: "custom software · automation · industrial integrations",
};

export default function OgImage({ params }: { params: { locale: string } }) {
  const tagline = TAGLINE[params.locale] ?? TAGLINE.en;

  return new ImageResponse(
    <div
      style={{
        background: BG,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "68px 80px",
        // Cyjanowa poświata u góry — ten sam gest co .bg-hero-ambient na stronie.
        // Celowo linear, nie radial: generator obrazu (Satori) nie parsuje składni
        // radial-gradient z dwiema długościami i pozycją, i wywala się na renderze.
        backgroundImage: `linear-gradient(180deg, #002831 0%, ${BG} 45%)`,
      }}
    >
      {/* Góra — sygnet + wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <svg width="30" height="36" viewBox="0 0 200 240" fill={ACCENT}>
          <g transform="translate(-206.02975,-75.94052)">
            <path d="m 325.62975,85.64052 c 9.3,5.4 31,17.9 48.2,27.8 l 31.3,18 0.5,2 c 0.2,1.1 0.3,7.9 0.2,15.2 l -0.3,13.2 -7.5,-4.3 -7.5,-4.2 -0.5,-5.3 -0.5,-5.4 -15.5,-8.9 c -39.1,-22.6 -65.4,-37.2 -66.9,-37.1 -0.9,0.1 -12.2,6.1 -25.1,13.3 -12.9,7.2 -30.9,17.2 -40,22.2 -9.1,5 -17.3,10 -18.2,11.1 l -1.8,1.9 v 36.6 l 1.3,1 c 0.6,0.5 15.8,9.2 33.6,19.1 17.8,10 35.2,19.8 38.7,21.8 l 6.3,3.7 -0.9,1 c -0.5,0.6 -4.3,2.9 -8.4,5.1 l -7.6,4 -6.3,-3.4 c -14.9,-8.1 -70.3,-39.4 -71.4,-40.3 l -1.3,-1 v -59.5 l 1.8,-1.5 c 1.5,-1.4 18.8,-11.3 78.2,-44.8 8.5,-4.8 16.4,-9.2 17.5,-9.8 1.1,-0.6 2.7,-1.2 3.6,-1.2 0.8,0 9.2,4.4 18.5,9.7" />
            <path d="m 338.72975,143.44052 c 16.7,9.1 38.7,21.3 48.8,27.1 l 18.5,10.5 v 18.9 l -6.2,-3.1 c -6.5,-3.3 -28.6,-15.2 -63.8,-34.4 -11.3,-6.2 -22.4,-12.2 -24.6,-13.3 l -4.2,-2.1 -13.8,7.7 -13.9,7.8 -0.3,1.4 -0.2,1.5 3.7,2.1 c 2.1,1.1 20.1,11.2 40.1,22.4 l 36.2,20.3 v 20.4 l -20.7,11.7 c -11.3,6.4 -21.3,11.6 -22.2,11.5 -2.3,-0.1 -16.6,-8.3 -16.5,-9.4 0.1,-0.6 8.9,-5.9 19.8,-12 10.8,-6 19.6,-11.5 19.6,-12.1 0,-0.9 -46.6,-27.2 -73.5,-41.5 -5.5,-2.9 -10.3,-5.8 -10.7,-6.3 -0.4,-0.6 -0.8,-4.6 -0.8,-8.8 v -7.7 l 6.8,-3.7 c 3.7,-2.1 15.3,-8.6 25.7,-14.5 10.5,-6 19.7,-10.8 20.5,-10.9 0.7,0 15.1,7.4 31.7,16.5" />
            <path d="m 398.82975,213.24052 7.2,3.7 v 21.3 c 0,11.6 -0.4,21.7 -0.8,22.3 -1.2,1.9 -96.3,55.4 -98.3,55.4 -1,0 -21.6,-11.3 -82.4,-45.4 l -18,-10.1 -0.3,-21 c -0.1,-11.5 0,-21.5 0.3,-22.3 l 0.5,-1.3 7.2,4 7.3,4 0.5,12.2 0.5,12.1 8.5,4.7 c 4.7,2.6 15.9,9 25,14.1 40.8,23 49.9,28 51.1,28 1.1,0 19,-9.9 66.9,-37 8,-4.5 14.8,-8.7 15.2,-9.3 0.4,-0.7 0.8,-9.9 0.8,-20.5 v -19.4 l 0.8,0.4 c 0.4,0.2 4,2 8,4.1" />
          </g>
        </svg>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 1 }}>
          <span style={{ color: TEXT, fontWeight: 300 }}>sin</span>
          <span style={{ color: TEXT, fontWeight: 800 }}>core</span>
        </div>
      </div>

      {/* Środek — motto */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            color: TEXT,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          It works.
        </div>
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            color: ACCENT,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          That&apos;s the point.
        </div>
      </div>

      {/* Dół — linia, zakres prac, domena */}
      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        <div style={{ display: "flex", height: 1, background: SURFACE, width: "100%" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 20,
          }}
        >
          <span style={{ color: MUTED }}>{tagline}</span>
          <span style={{ color: ACCENT_SOFT }}>sincore.io</span>
        </div>
      </div>
    </div>,
    { ...size }
  );
}
