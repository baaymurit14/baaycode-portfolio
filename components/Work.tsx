import { ArrowUpRight } from "lucide-react";
import { projects, profile } from "@/lib/data";
import SectionHead from "./SectionHead";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

export default function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="section-y relative border-t border-line"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-copper-wash opacity-60" />

      <div className="container-bleed relative">
        <SectionHead
          headingId="work-heading"
          eyebrow="Selected Work"
          heading={["Projets", "retenus"]}
          lede="Quatre projets qui montrent la méthode : partir d'un problème réel, choisir la bonne chaîne technique, livrer quelque chose qui fonctionne."
          aside={`${String(projects.length).padStart(2, "0")} projets`}
          accent="copper"
          headingClassName="text-display-md"
        />

        <div className="mt-14 sm:mt-20">
          {projects.map((project, i) => (
            <div key={project.slug} className={i > 0 ? "mt-10 sm:mt-14" : ""}>
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>

        {/* Everything else lives on GitHub. */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8 sm:mt-20">
            <p className="max-w-prose text-sm leading-relaxed text-ink-muted">
              D&apos;autres expériences, explorations et contributions sont
              disponibles sur mon profil.
            </p>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-ghost"
            >
              Voir GitHub
              <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
