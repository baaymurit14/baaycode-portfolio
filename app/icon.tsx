import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Edge runtime — see the note in app/opengraph-image.tsx. */
export const runtime = "edge";

/** Tab icon: the PDS monogram in the copper accent. */
export default function Icon() {
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
          color: "#C9793F",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        PD
      </div>
    ),
    size
  );
}
