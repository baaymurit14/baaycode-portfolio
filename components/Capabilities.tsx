import Image from "next/image";
import { Award } from "lucide-react";
import { certifications, skillGroups } from "@/lib/data";
import { getMedia } from "@/lib/media";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

/**
 * "Capabilities" — the toolset, plus a separate certifications block.
 *
 * No skill bars and no percentages: a bar would imply a measured level that
 * isn't measured. The list is a set, and it is presented as one.
 */
export default function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="section-y relative border-t border-line"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-signal-wash opacity-50"
      />

      <div className="container-bleed relative">
        <SectionHead
          headingId="capabilities-heading"
          eyebrow="Capabilities"
          heading={["Compétences"]}
          lede="La chaîne technique que j'utilise, du HTML au microcontrôleur."
          accent="signal"
          headingClassName="text-display-md"
        />

        <div className="mt-14 grid gap-x-10 gap-y-10 sm:mt-20 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={(i % 3) * 0.06} duration={0.6}>
              <div className="group border-t border-line pt-5">
                <h3
                  className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                    group.accent === "copper" ? "text-copper" : "text-signal"
                  }`}
                >
                  {group.label}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border border-line px-2.5 py-1 font-mono text-[11px] tracking-[0.04em] text-ink-muted transition-colors duration-300 hover:border-line-strong hover:text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* --- Certifications, given their own slot --- */}
          <Reveal delay={0.12} duration={0.6} className="md:col-span-2 xl:col-span-3">
            <div className="border-t border-line pt-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper">
                Certifications &amp; compétences additionnelles
              </h3>

              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {certifications.map((cert) => {
                  const media = getMedia(cert.mediaKey);
                  return (
                    <li
                      key={cert.id}
                      className="group grid grid-cols-[auto_1fr] gap-5 border border-line bg-base-raised/60 p-4 transition-colors duration-400 hover:border-copper/40 sm:p-5"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-base sm:h-28 sm:w-24">
                        <Image
                          src={media.src}
                          alt={media.alt}
                          width={media.w}
                          height={media.h}
                          loading="lazy"
                          sizes="96px"
                          className="h-full w-full object-cover grayscale transition-all duration-700 ease-editorial group-hover:scale-105 group-hover:grayscale-0"
                          style={{ objectPosition: media.position }}
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/60 to-transparent"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1.5 border border-signal/35 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-signal">
                            <Award size={11} strokeWidth={1.8} aria-hidden="true" />
                            {cert.status}
                          </span>
                        </div>

                        <h4 className="mt-3 font-display text-xl uppercase leading-none text-ink">
                          {cert.title}
                        </h4>

                        {/*
                          The issuing organisation is only rendered once it has
                          been read off the original certificate and flagged as
                          verified in lib/data.ts. Until then nothing is shown
                          here rather than a guess.
                        */}
                        {cert.issuerVerified && cert.issuer && (
                          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-copper">
                            {cert.issuer}
                          </p>
                        )}

                        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                          {cert.note}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
