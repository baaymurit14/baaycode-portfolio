import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Edge runtime — see the note in app/opengraph-image.tsx. */
export const runtime = "edge";

/** Home-screen icon for iOS: monogram on the dark base colour. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0D10",
          border: "6px solid #C9793F",
          color: "#E9EBEC",
          fontSize: 74,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        PDS
      </div>
    ),
    size
  );
}
