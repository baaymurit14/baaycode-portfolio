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
