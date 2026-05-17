import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "sincore — It works. That's the point.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "monospace",
        }}
      >
        {/* Top — logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#7c3aed", fontSize: 22, letterSpacing: 2 }}>{">"}</span>
          <span style={{ color: "#e2e8f0", fontSize: 22, letterSpacing: 3 }}>sincore</span>
        </div>

        {/* Middle — główna treść */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#7c3aed",
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            sincore
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a78bfa",
              fontStyle: "italic",
              borderLeft: "3px solid #7c3aed",
              paddingLeft: 20,
            }}
          >
            It works. That&apos;s the point.
          </div>
        </div>

        {/* Bottom — tagline + url */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <span style={{ color: "#64748b", fontSize: 18 }}>
            custom software · automation · integrations · industrial
          </span>
          <span style={{ color: "#7c3aed", fontSize: 18, opacity: 0.7 }}>sincore.io</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
