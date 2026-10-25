import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import MyStory from "@/components/MyStory";
import WhatIBuild from "@/components/WhatIBuild";
import Work from "@/components/Work";
import Moments from "@/components/Moments";
import Journey from "@/components/Journey";
import Recognition from "@/components/Recognition";
import Capabilities from "@/components/Capabilities";
import Vision from "@/components/Vision";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { projects, seo, siteUrl } from "@/lib/data";

/**
 * Home-page structured data.
 *
 * The Person/WebSite/Organization nodes live in the root layout; this graph
 * adds the page type and the project list, both linked by `@id`.
 */
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: `${siteUrl}/`,
      name: seo.title,
      description: seo.description,
      inLanguage: "fr-FR",
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: { "@id": `${siteUrl}/#person` },
      about: { "@id": `${siteUrl}/#person` },
      hasPart: { "@id": `${siteUrl}/#projects` },
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#projects`,
      name: "Projets sélectionnés",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          alternateName: project.subtitle,
          description: project.summary,
          author: { "@id": `${siteUrl}/#person` },
          ...(project.href ? { url: `${siteUrl}${project.href}` } : {}),
          ...(project.tech.length
            ? { keywords: project.tech.join(", ") }
            : {}),
        },
      })),
    },
  ],
};

/**
 * BAAYCODE — narrative order.
 *
 * The order is the argument:
 *   Hero        → who this is
 *   Manifesto   → the six movements, as a contents page
 *   My Story    → the person behind the brand
 *   What I Build→ the shape of the work
 *   Work        → the proof
 *   Moments     → the human texture
 *   Journey     → how it happened
 *   Recognition → what it returned
 *   Capabilities→ the toolset
 *   Vision      → where it goes next
 *   Contact     → the open door
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, developer-authored JSON-LD — no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
        <MyStory />
        <WhatIBuild />
        <Work />
        <Moments />
        <Journey />
        <Recognition />
        <Capabilities />
        <Vision />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
