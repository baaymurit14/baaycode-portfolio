import { Mail, Phone, Github, Linkedin, MapPin, ArrowUpRight } from "lucide-react";
import { brand, contact, profile } from "@/lib/data";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import Marquee from "./Marquee";

export default function Contact() {
  const tel = profile.phone.replace(/\s/g, "");

  const channels = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      external: false,
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: profile.phone,
      href: `tel:${tel}`,
      external: false,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/baaymurit14",
      href: profile.github,
      external: true,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "in/pape-djibril-séne",
      href: profile.linkedin,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative border-t border-line"
    >
      <div className="container-bleed section-y">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* --- Invitation --- */}
          <div className="lg:col-span-7">
            <SectionHead
              headingId="contact-heading"
              eyebrow={contact.eyebrow}
              heading={contact.heading}
              lede={contact.body}
              accent="copper"
              headingClassName="text-display-md"
            />

            <Reveal delay={0.16}>
              <a
                href={`mailto:${profile.email}`}
                className="btn-primary btn-scan mt-11"
              >
                <span className="scan-sweep" aria-hidden="true" />
                {profile.email}
                <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
              </a>
            </Reveal>

            <Reveal delay={0.22}>
              <p className="mt-8 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                <MapPin size={13} strokeWidth={1.6} aria-hidden="true" />
                {profile.location}
              </p>
            </Reveal>
          </div>

          {/* --- Channels --- */}
          <div className="lg:col-span-5">
            <ul className="border-t border-line">
              {channels.map((c, i) => {
                const Icon = c.icon;
                return (
                  <Reveal as="li" key={c.label} delay={i * 0.06} duration={0.55}>
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noreferrer noopener" : undefined}
                      className="group flex items-center gap-5 border-b border-line py-5 transition-colors duration-300 hover:bg-base-raised/40 sm:px-3"
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="shrink-0 text-ink-faint transition-colors duration-300 group-hover:text-copper"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                          {c.label}
                        </span>
                        <span className="mt-1 block truncate text-sm text-ink transition-colors duration-300 group-hover:text-copper">
                          {c.value}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </a>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* The thesis, one last time, at full width. */}
      <div className="border-y border-line py-8 sm:py-10">
        <Marquee
          items={[
            brand.thesisFr,
            "Disponible pour des projets",
            "Web",
            "IoT",
            "Cloud",
          ]}
          accent="ink"
        />
      </div>
    </section>
  );
}
