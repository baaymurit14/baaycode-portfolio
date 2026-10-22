import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import MediaFrame from "@/components/MediaFrame";
import Caption from "@/components/Caption";
import {
  brand,
  distinctions,
  kaaraangeCase,
  projects,
  siteUrl,
  type Distinction,
  type DistinctionDoc,
} from "@/lib/data";
import { getMedia, type MediaIndexKey } from "@/lib/media";

export const metadata: Metadata = {
  title: "Kaaraange — Système intelligent de gestion des déchets biomédicaux",
  description: projects.find((p) => p.slug === "kaaraange")!.summary,
  alternates: { canonical: "/kaaraange" },
  openGraph: {
    type: "article",
    url: `${siteUrl}/kaaraange`,
    title: "Kaaraange — Système intelligent de gestion des déchets biomédicaux",
    description: projects.find((p) => p.slug === "kaaraange")!.summary,
    locale: "fr_FR",
    images: [
      {
        url: "/kaaraange/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Kaaraange — dispositif IoT de gestion des déchets biomédicaux",
      },
    ],
  },
};

const k = kaaraangeCase;
const project = projects.find((p) => p.slug === "kaaraange")!;

/** The three distinctions that belong to Kaaraange (MIABE is Tukki's). */
const kaaraangeDistinctions = distinctions.filter((d) => d.project === "Kaaraange");

/**
 * The Kaaraange distinctions, flattened to one entry per document so an award
 * that produced two sheets (Geneva) shows both. Awards with no document in the
 * set keep a single typographic plate.
 */
type KaaraangePlate = { d: Distinction; doc: DistinctionDoc | null };

const kaaraangePlates: KaaraangePlate[] = kaaraangeDistinctions.reduce<
  KaaraangePlate[]
>((acc, d) => {
  if (d.docs.length === 0) {
    acc.push({ d, doc: null });
  } else {
    for (const doc of d.docs) acc.push({ d, doc });
  }
  return acc;
}, []);

/* ================================================================== *
 * HERO
 * ================================================================== */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="substrate absolute inset-0 opacity-60" />
      <div aria-hidden="true" className="absolute inset-0 bg-signal-wash" />

      <div className="container-bleed relative pb-16 pt-32 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-48">
        <Reveal direction="none">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wide2 text-ink-faint transition-colors duration-200 hover:text-copper"
          >
            <ArrowLeft size={14} strokeWidth={1.6} aria-hidden="true" />
            Retour aux projets
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal direction="none">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="pad-label pad-label--copper">
                  Case study — {k.index}
                </span>
                <span className="font-mono text-micro uppercase text-ink-faint">
                  {k.sector}
                </span>
              </div>
            </Reveal>

            <h1 className="mt-7 font-display text-display-xl uppercase text-ink">
              {k.name}
            </h1>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-prose font-display text-display-sm uppercase leading-tight text-signal">
                {k.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="lede mt-9">{k.overview.heading}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal delay={0.28}>
              <dl className="divide-y divide-line border-y border-line">
                {[
                  { t: "Rôle", v: project.role },
                  { t: "Année", v: k.year },
                  { t: "Résultat", v: project.result },
                ].map((row) => (
                  <div key={row.t} className="py-4">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                      {row.t}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-snug text-ink">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.34}>
          <ul className="mt-12 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li
                key={t}
                className="border border-line-strong px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint transition-colors duration-300 hover:border-signal/45 hover:text-signal"
              >
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Full-bleed opening plate: the project in the field. */}
      <div className="relative">
        <MediaFrame
          media={getMedia("setup")}
          aspect="aspect-[16/10] sm:aspect-[21/9]"
          className="w-full"
          sizes="100vw"
          priority
          depth={14}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base via-base/10 to-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-5 right-5 font-display text-[6rem] font-bold leading-none text-ink/10 sm:text-[11rem]"
          >
            {k.index}
          </span>
        </MediaFrame>
      </div>
    </section>
  );
}

/* ================================================================== *
 * PLATE — a reusable full-width photographic break
 * ================================================================== */

function Plate({
  mediaKey,
  context,
  caption,
  ratio = "aspect-[16/10] sm:aspect-[21/9]",
  accent = "signal",
  flip = false,
}: {
  mediaKey: MediaIndexKey;
  context: string;
  caption: string;
  ratio?: string;
  accent?: "copper" | "signal";
  flip?: boolean;
}) {
  return (
    <section className="border-y border-line bg-base-deep">
      <div className="container-bleed py-10 sm:py-14">
        <figure className={flip ? "lg:flex lg:items-end lg:gap-10" : ""}>
          <div className={flip ? "lg:flex-1" : ""}>
            <MediaFrame
              media={getMedia(mediaKey)}
              aspect={ratio}
              sizes="(max-width: 1024px) 100vw, 92vw"
              depth={12}
            />
          </div>
          <figcaption
            className={
              flip
                ? "mt-5 shrink-0 lg:mb-4 lg:mt-0 lg:w-56"
                : "mt-5"
            }
          >
            <Caption
              context={context}
              text={caption}
              accent={accent}
              className="m-0 border-t border-line pt-4"
            />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ================================================================== *
 * 01 · OVERVIEW
 * ================================================================== */

function Overview() {
  return (
    <section className="section-y">
      <div className="container-bleed">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHead
              headingId="k-overview"
              eyebrow="01 — Overview"
              heading={["Le", "système"]}
              accent="copper"
              headingClassName="text-display-md"
            />
            <Reveal delay={0.12}>
              <p className="lede mt-9">{k.overview.body[0]}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            <Reveal delay={0.18}>
              <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink-faint">
                {brand.thesisFr} — un problème de terrain, une chaîne technique
                complète, un résultat primé trois fois.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== *
 * 02 · PROBLEM
 * ================================================================== */

function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="k-problem"
      className="section-y border-t border-line bg-base-raised"
    >
      <div className="container-bleed">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHead
              headingId="k-problem"
              eyebrow={`02 — ${k.problem.label}`}
              heading={["Le", "problème"]}
              accent="copper"
              headingClassName="text-display-md"
            />
            <div className="mt-9 space-y-5">
              {k.problem.body.map((p, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <p className="prose-body">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <figure className="lg:col-span-6">
            <MediaFrame
              media={getMedia(k.problem.media)}
              aspect="aspect-[4/5]"
              sizes="(max-width: 1024px) 100vw, 46vw"
              depth={12}
            />
            <Caption context="Le problème" text="Concevoir, câbler, itérer" />
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== *
 * 03 · SOLUTION
 * ================================================================== */

function Solution() {
  return (
    <section
      id="solution"
      aria-labelledby="k-solution"
      className="section-y"
    >
      <div className="container-bleed">
        <SectionHead
          headingId="k-solution"
          eyebrow={`03 — ${k.solution.label}`}
          heading={["La", "solution"]}
          lede={k.solution.heading}
          accent="signal"
          headingClassName="text-display-md"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5">
            {k.solution.body.map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <p className="prose-body">{p}</p>
              </Reveal>
            ))}
          </div>

          <figure>
            <MediaFrame
              media={getMedia("kaaraangeVisit")}
              aspect="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 46vw"
              depth={12}
            />
            <Caption
              context="Démonstration"
              text="Le dispositif, en conditions réelles"
            />
          </figure>
        </div>

        {/* The four-step flow */}
        <ol className="mt-16 grid gap-px border border-line bg-line sm:mt-20 lg:grid-cols-4">
          {k.solution.flow.map((step, i) => (
            <Reveal as="li" key={step.step} delay={i * 0.07} className="bg-base">
              <div className="group h-full p-6 transition-colors duration-400 hover:bg-base-raised sm:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-4xl leading-none text-copper/70 transition-colors duration-300 group-hover:text-copper">
                    {step.step}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 bg-signal/50 transition-colors duration-300 group-hover:bg-signal"
                  />
                </div>
                <h3 className="mt-6 font-display text-xl uppercase leading-none text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ================================================================== *
 * 04 · ARCHITECTURE
 * ================================================================== */

function Architecture() {
  return (
    <section
      id="architecture"
      aria-labelledby="k-architecture"
      className="section-y border-t border-line bg-base-deep"
    >
      <div className="container-bleed">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHead
              headingId="k-architecture"
              eyebrow={`04 — ${k.architecture.label}`}
              heading={["L'architecture"]}
              lede={k.architecture.body}
              accent="signal"
              headingClassName="text-display-md"
            />

            {/* The layered diagram. Pure SVG/CSS, no images. */}
            <div className="mt-12 overflow-x-auto border border-line bg-base-panel/60 p-6 sm:p-9">
              <div className="flex min-w-[380px] flex-col items-center">
                {k.architecture.layers.map((layer, i) => (
                  <Reveal key={layer.label} delay={0.06 + i * 0.06} className="w-full max-w-md">
                    <div className="border border-line-strong bg-base px-5 py-4 text-center transition-colors duration-300 hover:border-signal/50">
                      <p className="font-display text-base text-ink">{layer.label}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                        {layer.sub}
                      </p>
                    </div>
                    {i < k.architecture.layers.length - 1 && (
                      <div className="flex justify-center" aria-hidden="true">
                        <span className="h-8 w-px bg-signal/40" />
                      </div>
                    )}
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <figure className="relative lg:col-span-5">
            <div className="relative isolate flex items-center justify-center py-4">
              {/* Signal glow behind the cut-out, so the transparent PNG sits
                  in the page instead of floating on a hard rectangle. */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-3xl"
              />
              <Image
                src={getMedia(k.architecture.media).src}
                alt={getMedia(k.architecture.media).alt}
                width={getMedia(k.architecture.media).w}
                height={getMedia(k.architecture.media).h}
                sizes="(max-width: 1024px) 90vw, 420px"
                loading="lazy"
                className="relative mx-auto h-auto w-full max-w-[420px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)] animate-chipFloat motion-reduce:animate-none"
              />
            </div>
            <Caption
              context="Dispositif"
              text="Conteneur intelligent — prototype Kaaraange"
              accent="signal"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== *
 * 05 · HARDWARE
 * ================================================================== */

function Hardware() {
  return (
    <section
      id="hardware"
      aria-labelledby="k-hardware"
      className="section-y"
    >
      <div className="container-bleed">
        <SectionHead
          headingId="k-hardware"
          eyebrow={`05 — ${k.hardware.label}`}
          heading={["Le", "matériel"]}
          lede={k.hardware.heading}
          accent="copper"
          headingClassName="text-display-md"
        />

        {/* Three bench photographs, mixed weights. */}
        <div className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-3">
          {k.hardware.media.map((key, i) => (
            <Reveal key={key} delay={i * 0.08} className={i === 1 ? "sm:mt-10" : ""}>
              <figure>
                <MediaFrame
                  media={getMedia(key)}
                  aspect="aspect-[3/4]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  depth={10}
                />
              </figure>
            </Reveal>
          ))}
        </div>

        <ul className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {k.hardware.items.map((item, i) => (
            <Reveal as="li" key={item.name} delay={(i % 3) * 0.06} className="bg-base">
              <div className="h-full p-6 transition-colors duration-300 hover:bg-base-raised">
                <p className="font-display text-lg uppercase text-ink">{item.name}</p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-signal">
                  {item.role}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-prose font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-ink-faint">
            {k.hardware.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== *
 * 06 · CLOUD
 * ================================================================== */

function Cloud() {
  return (
    <section
      id="cloud"
      aria-labelledby="k-cloud"
      className="section-y border-t border-line bg-base-raised"
    >
      <div className="container-bleed">
        <SectionHead
          headingId="k-cloud"
          eyebrow={`06 — ${k.cloud.label}`}
          heading={["La", "liaison"]}
          lede={k.cloud.heading}
          accent="signal"
          headingClassName="text-display-md"
        />

        <ul className="mt-14 grid gap-px border border-line bg-line sm:mt-20 lg:grid-cols-4">
          {k.cloud.items.map((item, i) => (
            <Reveal as="li" key={item.name} delay={i * 0.06} className="bg-base">
              <div className="group h-full p-6 transition-colors duration-300 hover:bg-base-raised sm:p-7">
                <p className="font-display text-xl uppercase text-signal">{item.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {item.role}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* Software, set as a two-column editorial block. */}
        <div className="mt-16 grid gap-12 border-t border-line pt-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              07 — {k.backend.label}
            </h3>
            <p className="mt-5 font-display text-2xl uppercase text-ink">
              {k.backend.heading}
            </p>
            <div className="mt-5 space-y-4">
              {k.backend.body.map((p, i) => (
                <p key={i} className="prose-body">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              08 — {k.frontend.label}
            </h3>
            <p className="mt-5 font-display text-2xl uppercase text-ink">
              {k.frontend.heading}
            </p>
            <div className="mt-5 space-y-4">
              {k.frontend.body.map((p, i) => (
                <p key={i} className="prose-body">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== *
 * 09 · RESULTS + RECOGNITION
 * ================================================================== */

function Results() {
  return (
    <>
      <section
        id="results"
        aria-labelledby="k-results"
        className="section-y"
      >
        <div className="container-bleed">
          <SectionHead
            headingId="k-results"
            eyebrow={`09 — ${k.results.label}`}
            heading={["Le", "résultat"]}
            lede={k.results.heading}
            accent="copper"
            headingClassName="text-display-md"
          />

          <dl className="mt-14 grid gap-px border border-line bg-line sm:mt-20 sm:grid-cols-3">
            {k.results.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.07} className="bg-base">
                <div className="px-6 py-9 text-center sm:py-12">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl uppercase leading-none text-ink sm:text-5xl">
                      {stat.value}
                    </span>
                    <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.16em] text-copper">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="recognition"
        aria-labelledby="k-recognition"
        className="section-y border-t border-line bg-base-deep"
      >
        <div className="container-bleed">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHead
                headingId="k-recognition"
                eyebrow={`10 — ${k.recognition.label}`}
                heading={["La", "reconnaissance"]}
                lede={k.recognition.body}
                accent="copper"
                headingClassName="text-[clamp(2rem,4vw,4.75rem)]"
              />
              <Reveal delay={0.16}>
                <Link href="/#recognition" className="btn-ghost mt-10">
                  Toutes les distinctions
                  <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
                </Link>
              </Reveal>
            </div>

            {/* The original documents, set as plates. */}
            <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
              {kaaraangePlates.map(({ d, doc }, i) => {
                if (!doc) {
                  return (
                    <Reveal
                      as="li"
                      key={d.id}
                      delay={i * 0.08}
                      className="flex aspect-[3/4] flex-col justify-end border border-line bg-base-raised p-5"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                        {d.year}
                      </span>
                      <span className="mt-2 font-display text-lg uppercase leading-tight text-ink">
                        {d.org}
                      </span>
                      <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-copper">
                        {d.result}
                      </span>
                    </Reveal>
                  );
                }
                const media = getMedia(doc.key);
                return (
                  <Reveal
                    as="li"
                    key={`${d.id}-${doc.key}`}
                    delay={i * 0.08}
                    className="group"
                    /* Documents tilt by a degree or two, like prints on a table. */
                    // eslint-disable-next-line react/no-unknown-property
                  >
                    <figure style={{ transform: `rotate(${doc.tilt}deg)` }}>
                      <div className="relative overflow-hidden border border-line-strong bg-base-raised shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] transition-shadow duration-500 group-hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.95)]">
                        <Image
                          src={media.src}
                          alt={media.alt}
                          width={media.w}
                          height={media.h}
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, 30vw"
                          className={`aspect-[3/4] w-full transition-transform duration-[1000ms] ease-editorial group-hover:scale-[1.04] ${
                            doc.fit === "contain"
                              ? "object-contain p-3"
                              : "object-cover object-top"
                          }`}
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
                        />
                      </div>
                      <figcaption className="mt-4">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-copper">
                          {d.result}
                        </span>
                        <span className="mt-1.5 block text-xs leading-snug text-ink-muted">
                          {d.org}
                        </span>
                        <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
                          {doc.label}
                        </span>
                      </figcaption>
                    </figure>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

/* ================================================================== *
 * 11 · CLOSING GALLERY
 * ================================================================== */

function ClosingGallery() {
  return (
    <section
      id="gallery"
      aria-labelledby="k-gallery"
      className="section-y border-t border-line"
    >
      <div className="container-bleed">
        <SectionHead
          headingId="k-gallery"
          eyebrow="11 — En images"
          heading={["Le projet", "en frames"]}
          accent="signal"
          headingClassName="text-display-md"
        />

        <div className="mt-14 grid gap-4 sm:mt-20 lg:grid-cols-12">
          {k.gallery.map((item, i) => {
            const wide = i === 0 || i === 3;
            return (
              <Reveal
                key={item.key}
                delay={(i % 3) * 0.07}
                className={wide ? "lg:col-span-8" : "lg:col-span-4"}
              >
                <figure>
                  <MediaFrame
                    media={getMedia(item.key)}
                    aspect={wide ? "aspect-[16/10]" : "aspect-[4/3]"}
                    sizes={wide ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
                    depth={10}
                  />
                  <Caption context={item.context} text={item.caption} />
                </figure>
              </Reveal>
            );
          })}
        </div>

        {/* Close: back to the whole picture. */}
        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
            <p className="max-w-prose font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink-faint">
              {brand.mark} — {brand.thesisFr}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#work" className="btn-ghost">
                <ArrowLeft size={15} strokeWidth={1.6} aria-hidden="true" />
                Tous les projets
              </Link>
              <Link href="/#contact" className="btn-primary">
                Parler d&apos;un projet
                <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== *
 * PAGE
 * ================================================================== */

export default function KaaraangePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Overview />
        <Problem />

        {/* Big team photograph as a full-bleed break, right after the problem. */}
        <Plate
          mediaKey="team"
          context="Équipe"
          caption="L'équipe Kaaraange — Orange Summer Challenge 2025"
          accent="copper"
          flip
        />

        <Solution />
        <Architecture />
        <Hardware />
        <Cloud />

        {/* Presentation photograph as a full-bleed break. */}
        <Plate
          mediaKey="presentationKaaraange"
          context="Présentation"
          caption="Kaaraange devant un public"
        />

        <Results />

        {/* Certificate plate, then the closing gallery. */}
        <Plate
          mediaKey="bench2"
          context="Tests"
          caption="Essais techniques du système"
          ratio="aspect-[16/10] sm:aspect-[2/1]"
        />

        <ClosingGallery />
      </main>
      <Footer />
    </>
  );
}
