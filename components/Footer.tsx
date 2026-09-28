import Link from "next/link";
import { brand, nav, profile, siteUrl } from "@/lib/data";
import BrandMark from "./BrandMark";
import Monogram from "./Monogram";

export default function Footer() {
  const year = new Date().getFullYear();
  const domain = siteUrl.replace("https://", "");

  return (
    <footer className="relative border-t border-line bg-base-deep">
      <div className="container-bleed py-14 sm:py-20">
        {/* --- Oversized brand signature --- */}
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-4">
              <Monogram size="md" accent="signal" />
              <BrandMark as="p" size="lg" />
            </div>
            <p className="mt-4 max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink-faint">
              {brand.person} — {profile.role}
              <br />
              {brand.tagline}
            </p>
          </div>

          <div className="text-right">
            <p className="font-display text-display-sm uppercase leading-none text-ink/10">
              {brand.thesisFr}
            </p>
          </div>
        </div>

        {/* --- Navigation & legal --- */}
        <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:mt-20 md:grid-cols-3">
          <nav aria-label="Sections du site">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Sections
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {nav.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted transition-colors duration-200 hover:text-copper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Autres pages">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Projet
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/kaaraange"
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted transition-colors duration-200 hover:text-copper"
                >
                  Kaaraange — case study
                </Link>
              </li>
            </ul>

            <h2 className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Ailleurs
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted transition-colors duration-200 hover:text-copper"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted transition-colors duration-200 hover:text-copper"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Contact
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all font-mono text-[11px] tracking-[0.06em] text-ink-muted transition-colors duration-200 hover:text-copper"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.phone.replace(/\s/g, "")}
                  className="font-mono text-[11px] tracking-[0.06em] text-ink-muted transition-colors duration-200 hover:text-copper"
                >
                  {profile.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Colophon --- */}
        <div className="mt-14 flex flex-col-reverse gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            © {year} {brand.mark} — {brand.person}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Conçu et développé à Dakar —{" "}
            <a
              href={siteUrl}
              className="text-ink-muted transition-colors duration-200 hover:text-copper"
            >
              {domain}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
