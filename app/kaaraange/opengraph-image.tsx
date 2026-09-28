import { ImageResponse } from "next/og";
import { brand, siteUrl } from "@/lib/data";

export const alt =
  "Kaaraange — Système intelligent de gestion des déchets biomédicaux (IoT, Cloud)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Edge runtime — see the note in app/opengraph-image.tsx. */
export const runtime = "edge";

/** Social preview for the Kaaraange case study. */
export default async function KaaraangeOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0D10",
          padding: "68px 76px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 660,
            height: 460,
            background:
              "radial-gradient(100% 100% at 100% 0%, rgba(63,191,174,0.22) 0%, rgba(10,13,16,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#C9793F", fontSize: 20, letterSpacing: 6, display: "flex" }}>
            CASE STUDY — 01
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#5C666F",
              fontSize: 17,
              letterSpacing: 4,
            }}
          >
            {brand.mark}
            <div style={{ width: 6, height: 6, background: "#3FBFAE", display: "flex" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#E9EBEC",
              fontSize: 118,
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: -4,
              display: "flex",
            }}
          >
            Kaaraange
          </div>
          <div
            style={{
              color: "#3FBFAE",
              fontSize: 32,
              letterSpacing: 1,
              display: "flex",
              marginTop: 22,
            }}
          >
            Intelligent Biomedical Waste Management
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 34,
              color: "#9AA3AB",
              fontSize: 20,
              letterSpacing: 2,
            }}
          >
            {[
              "IoT",
              "RFID/NFC",
              "MQTT",
              "AWS IoT Core",
              "Spring Boot",
              "React",
            ].map((t) => (
              <div
                key={t}
                style={{
                  border: "1px solid #2C343C",
                  padding: "8px 16px",
                  display: "flex",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #20262D",
            paddingTop: 26,
          }}
        >
          <div style={{ color: "#C9793F", fontSize: 22, letterSpacing: 2, display: "flex" }}>
            Orange Summer Challenge · Médaille d&apos;argent Genève · Eurocham
          </div>
          <div style={{ color: "#5C666F", fontSize: 20, display: "flex" }}>
            {siteUrl.replace("https://", "")}/kaaraange
          </div>
        </div>
      </div>
    ),
    size
  );
}
