import Link from "next/link";
import { brand } from "@/lib/data";

export const metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="container-page flex min-h-[100svh] flex-col justify-center py-32">
      <p className="pad-label pad-label--copper">Erreur 404</p>
      <h1 className="mt-8 font-display text-display-lg uppercase text-ink">
        Signal
        <br />
        perdu
      </h1>
      <p className="lede mt-8 max-w-prose">
        Cette page n&apos;existe pas ou a été déplacée. Le signal est perdu, mais
        le système reste en ligne.
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-4">
        <Link href="/" className="btn-primary">
          Retour à l&apos;index
        </Link>
        <Link href="/kaaraange" className="btn-ghost">
          Voir Kaaraange
        </Link>
      </div>
      <p className="mt-20 font-mono text-micro uppercase text-ink-faint">
        {brand.mark} — {brand.thesisFr}
      </p>
    </main>
  );
}
