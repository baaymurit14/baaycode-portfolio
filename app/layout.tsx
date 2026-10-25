import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl, brand, profile, seo } from "@/lib/data";
import "./globals.css";

const display = localFont({
  src: "../public/fonts/SpaceGrotesk-latin.woff2",
  weight: "500 700",
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: "../public/fonts/Inter-latin.woff2",
  weight: "400 600",
  variable: "--font-body",
  display: "swap",
});

const mono = localFont({
  src: "../public/fonts/JetBrainsMono-latin.woff2",
  weight: "400 500",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: seo.title,
    template: "%s | BAAYCODE",
  },
  description: seo.description,
  applicationName: brand.mark,
  authors: [{ name: brand.person, url: `${siteUrl}/` }],
  creator: brand.person,
  publisher: brand.mark,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "BAAYCODE",
    "Pape Djibril SÉNE",
    "développeur Full-Stack Dakar",
    "développeur IoT Sénégal",
    "portfolio développeur Sénégal",
    "Kaaraange",
    "gestion des déchets biomédicaux",
    "Spring Boot",
    "React",
    "AWS IoT Core",
    "MQTT",
    "ESP32",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", sizes: "32x32" },
    ],
    apple: "/apple-icon",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: `${siteUrl}/`,
    siteName: brand.mark,
    locale: seo.locale,
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${brand.person} — ${profile.role} — ${brand.mark}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0A0D10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Structured data. Three linked entities:
 *  - Organization: the BAAYCODE studio/brand.
 *  - Person: who the site is about.
 *  - WebSite: the BAAYCODE surface.
 * Claims are limited to what is actually documented in lib/data.ts.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: brand.mark,
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/apple-icon`,
      },
      description: `${brand.mark} — ${brand.tagline}. ${brand.thesisFr}.`,
      founder: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: brand.mark,
      alternateName: brand.person,
      description: seo.description,
      inLanguage: "fr-FR",
      publisher: { "@id": `${siteUrl}/#organization` },
      about: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: brand.person,
      url: `${siteUrl}/`,
      image: `${siteUrl}/images/profile/profile.jpeg`,
      email: `mailto:${profile.email}`,
      jobTitle: profile.role,
      description: profile.valueProposition,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dakar",
        addressCountry: "SN",
      },
      sameAs: [profile.github, profile.linkedin],
      knowsAbout: [
        "Full-Stack Development",
        "Internet of Things",
        "Cloud",
        "Java",
        "Spring Boot",
        "React",
        "AWS IoT Core",
        "MQTT",
        "ESP32",
        "RFID/NFC",
      ],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Université Alioune Diop de Bambey",
      },
      affiliation: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          // Static, developer-authored JSON-LD — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[100] bg-signal px-4 py-2 font-mono text-xs uppercase tracking-wide2 text-base"
        >
          Aller au contenu
        </a>
        {children}
        <Analytics />
        {/* Film plane over the whole document. Purely decorative. */}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
