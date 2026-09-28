"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/data";
import { getMedia } from "@/lib/media";
import Reveal from "./Reveal";

/**
 * A single project, set as an editorial entry rather than a card.
 *
 * The featured project gets the full-bleed plate; the rest stack as a compact
 * list with hairline rules. That hierarchy is what stops four projects from
 * looking like four equals.
 */
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduce = useReducedMotion();

  if (project.featured) return <FeaturedProject project={project} index={index} />;
  return <CompactProject project={project} index={index} />;
}

/* ------------------------------------------------------------------ *
 * Featured — full plate
 * ------------------------------------------------------------------ */

function FeaturedProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduce = useReducedMotion();
  const cover = project.coverKey === "none" ? null : getMedia(project.coverKey);

  return (
    <Reveal as="article" duration={0.8}>
      <div className="group relative grid gap-0 border border-line lg:grid-cols-2">
        {/* Plate */}
        <div className="relative overflow-hidden bg-base-raised">
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt}
              width={cover.w}
              height={cover.h}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-[4/3] w-full object-cover transition-transform duration-[1100ms] ease-editorial group-hover:scale-[1.04] lg:aspect-auto lg:h-full"
              style={{ objectPosition: cover.position }}
            />
          ) : (
            /* No photograph of this project exists: a typographic plate rather
               than an unrelated image borrowed from another project. */
            <div
              aria-hidden="true"
              className="aspect-[4/3] w-full lg:aspect-auto lg:h-full"
            >
              <div className="absolute inset-0 bg-grid bg-[size:26px_26px] opacity-50" />
              <span className="absolute inset-0 flex items-center justify-center font-display text-2xl uppercase tracking-[0.1em] text-ink-faint">
                {project.name}
              </span>
            </div>
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-vignette opacity-70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-base/70"
          />

          {/* Project index, set as a large numeral over the plate. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-5 font-display text-[5.5rem] font-bold leading-none text-ink/10 sm:text-[8rem]"
          >
            {project.index}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="pad-label pad-label--copper">Sélection</span>
            <span className="font-mono text-micro uppercase text-ink-faint">
              {project.year}
            </span>
          </div>

          <h3 className="mt-6 font-display text-display-sm uppercase leading-none text-ink">
            {project.name}
          </h3>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
            {project.subtitle}
          </p>

          <p className="mt-7 max-w-prose text-[0.975rem] leading-relaxed text-ink-muted">
            {project.description}
          </p>

          <dl className="mt-8 space-y-3 border-t border-line pt-6">
            <div className="grid grid-cols-[6.5rem_1fr] gap-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Rôle
              </dt>
              <dd className="text-sm text-ink">{project.role}</dd>
            </div>
            <div className="grid grid-cols-[6.5rem_1fr] gap-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Résultat
              </dt>
              <dd className="text-sm text-copper">{project.result}</dd>
            </div>
          </dl>

          <TechList tech={project.tech} />

          {project.href && (
            <Link
              href={project.href}
              className="btn-primary btn-scan mt-9 self-start"
              aria-label={`Ouvrir la case study ${project.name}`}
            >
              <span className="scan-sweep" aria-hidden="true" />
              Case study
              <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ *
 * Compact — hairline list entries
 * ------------------------------------------------------------------ */

function CompactProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduce = useReducedMotion();
  const cover =
    project.coverKey === "none" ? null : getMedia(project.coverKey);

  return (
    <Reveal as="article" delay={index * 0.06} duration={0.6}>
      <div className="group grid grid-cols-[auto_1fr] items-start gap-x-5 border-t border-line py-8 sm:grid-cols-[auto_11rem_1fr] sm:gap-x-8 lg:gap-x-12">
        <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint">
          {project.index}
        </span>

        {/* Thumbnail, where a real photograph exists. */}
        <div className="hidden sm:block">
          {cover ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-base-raised">
              <Image
                src={cover.src}
                alt={cover.alt}
                width={cover.w}
                height={cover.h}
                loading="lazy"
                sizes="176px"
                className="h-full w-full object-cover opacity-75 grayscale transition-all duration-700 ease-editorial group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                style={{ objectPosition: cover.position }}
              />
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-base-raised"
            >
              <div className="absolute inset-0 bg-grid bg-[size:22px_22px] opacity-60" />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                {project.name}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-2xl uppercase leading-none text-ink transition-colors duration-300 group-hover:text-copper sm:text-3xl">
              {project.name}
            </h3>
            {project.year && (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                {project.year}
              </span>
            )}
          </div>

          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
            {project.subtitle}
          </p>

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">
            {project.summary}
          </p>

          <p className="mt-4 text-sm text-copper">{project.result}</p>

          <TechList tech={project.tech} className="mt-5" />
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */

function TechList({ tech, className = "mt-7" }: { tech: string[]; className?: string }) {
  if (!tech.length) return null;
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-2 ${className}`}>
      {tech.map((t) => (
        <li
          key={t}
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint transition-colors duration-300 group-hover:text-ink-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
