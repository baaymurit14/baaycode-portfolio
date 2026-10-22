import { ImageResponse } from "next/og";
import { siteUrl, brand, profile } from "@/lib/data";

export const alt = `${brand.person} — ${profile.role} — ${brand.mark}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated on the edge runtime.
 *
 * Two reasons, both deliberate:
 *  - No wasm/w font payload is bundled into the Node server for a route that
 *    only ever runs on a cold start.
 *  - The Node build of `@vercel/og` in Next 14 resolves its bundled font and
 *    wasm paths with `path.join(import.meta.url, ...)`, which produces an
 *    invalid URL on Windows and breaks the build there. The edge runtime has no
 *    such filesystem access and is unaffected.
 */
export const runtime = "edge";

/**
 * Social preview, generated at build time.
 *
 * Design intent: the BAAYCODE mark and the person's name do the talking, split
 * by a hairline, in the brand's copper/teal split. Deliberately text-only so it
 * stays under ~40 KB and never depends on a photo being present.
 */
export default async function OpengraphImage() {
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
        {/* Substrate grid + copper wash, kept very low contrast. */}
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
            width: 620,
            height: 420,
            background:
              "radial-gradient(100% 100% at 100% 0%, rgba(201,121,63,0.20) 0%, rgba(10,13,16,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 620,
            height: 420,
            background:
              "radial-gradient(100% 100% at 0% 100%, rgba(63,191,174,0.18) 0%, rgba(10,13,16,0) 70%)",
            display: "flex",
          }}
        />

        {/* Top rail: brand + live marker */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 54,
                height: 54,
                border: "2px solid #C9793F",
                color: "#C9793F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              PDS
            </div>
            <div
              style={{
                color: "#E9EBEC",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 10,
                display: "flex",
              }}
            >
              BAAYCODE
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#5C666F",
              fontSize: 17,
              letterSpacing: 4,
            }}
          >
            <div
              style={{ width: 10, height: 10, borderRadius: 999, background: "#3FBFAE", display: "flex" }}
            />
            DAKAR · SÉNÉGAL
          </div>
        </div>

        {/* Name — the largest element, as on the site itself. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#5C666F",
              fontSize: 18,
              letterSpacing: 8,
              display: "flex",
              marginBottom: 18,
            }}
          >
            FROM IDEAS TO SYSTEMS
          </div>
          <div
            style={{
              color: "#E9EBEC",
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 0.94,
              letterSpacing: -3,
              display: "flex",
            }}
          >
            PAPE DJIBRIL SÉNE
          </div>
          <div
            style={{
              color: "#C9793F",
              fontSize: 34,
              letterSpacing: 2,
              display: "flex",
              marginTop: 22,
            }}
          >
            Développeur Full-Stack &amp; IoT
          </div>
        </div>

        {/* Bottom rail: positioning + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #20262D",
            paddingTop: 26,
          }}
        >
          <div style={{ color: "#9AA3AB", fontSize: 22, letterSpacing: 1, display: "flex" }}>
            Applications Web · IoT · Cloud · Innovation
          </div>
          <div style={{ color: "#3FBFAE", fontSize: 22, letterSpacing: 2, display: "flex" }}>
            {siteUrl.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size
  );
}
