import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BAAYCODE — Pape Djibril Sène",
    short_name: "BAAYCODE",
    description:
      "Pape Djibril Sène — Développeur Full-Stack & IoT. Applications Web, systèmes IoT et solutions Cloud.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0D10",
    theme_color: "#0A0D10",
    lang: "fr",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
