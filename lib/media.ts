/**
 * Central image registry — BAAYCODE
 *
 * Every image used anywhere on the site is declared here, once, with its
 * intrinsic dimensions (read from the source files) so `next/image` can reserve
 * the exact box and never shift layout.
 *
 * To swap a photo, replace the file at the same path in `public/images/...`
 * (keeping the format) or point `src` to your new path. No component needs to
 * be touched: no component contains a hard-coded image path.
 *
 * Dimensions were measured from the delivered files, so they are accurate.
 * If you replace a file with a differently-shaped one, update w/h here.
 */

export type MediaItem = {
  /** Path under /public. Keep it ASCII, kebab-case, no accents. */
  src: string;
  /** Intrinsic width in px. */
  w: number;
  /** Intrinsic height in px. */
  h: number;
  /** Meaningful alt text. Never empty, never the file name. */
  alt: string;
  /**
   * Focal point as a CSS object-position value. Used when the component crops
   * the image to a different aspect ratio than the source.
   */
  position?: string;
  /** Marks portrait-orientation sources so layouts can pick a portrait crop. */
  orientation?: "portrait" | "landscape" | "square";
};

const m = (
  src: string,
  w: number,
  h: number,
  alt: string,
  extra: Pick<MediaItem, "position" | "orientation"> = {}
): MediaItem => ({
  src,
  w,
  h,
  alt,
  orientation:
    extra.orientation ?? (w === h ? "square" : w > h ? "landscape" : "portrait"),
  ...(extra.position ? { position: extra.position } : {}),
});

/* ------------------------------------------------------------------ *
 * PROFILE — identity, one photo per role (never reuse the same shot)
 * ------------------------------------------------------------------ */

export const media = {
  /** Hero — the professional identity shot. Colour, portrait. */
  hero: m(
    "/images/profile/profile.jpeg",
    764,
    1280,
    "Pape Djibril SÉNE, développeur Full-Stack & IoT",
    { position: "50% 30%" }
  ),

  /**
   * "My Story" — the black & white portrait (traditional attire, arms
   * crossed). Rendered through the `.bw-editorial` filter in globals.css so the
   * monochrome + grain treatment is applied in CSS, not by re-editing the file.
   */
  story: m(
    "/images/personal/portrait-story.jpeg",
    810,
    1080,
    "Portrait en noir et blanc de Pape Djibril SÉNE",
    { position: "50% 28%" }
  ),

  /** Drone certification card. */
  drone: m(
    "/images/profile/drone.jpeg",
    720,
    960,
    "Pape Djibril SÉNE avec un drone lors d'une séance de pilotage",
    { position: "50% 40%" }
  ),

  /** Secondary portrait — used small, as a signature mark. */
  profile: m("/images/profile/profile.jpeg", 764, 1280, "Portrait de Pape Djibril SÉNE", {
    position: "50% 30%",
  }),
} as const;

/* ------------------------------------------------------------------ *
 * JOURNEY — events, talks, competitions
 * ------------------------------------------------------------------ */

export const journeyMedia = {
  presentationUcad: m(
    "/images/journey/presentation-ucad.jpeg",
    1080,
    719,
    "Présentation du projet devant un amphithéâtre universitaire"
  ),
  presentationKaaraange: m(
    "/images/journey/presentation-kaaraange.jpeg",
    1280,
    960,
    "Présentation de Kaaraange devant un public"
  ),
  kaaraangeVisit: m(
    "/images/journey/kaaraange-visit.jpeg",
    810,
    810,
    "Visite et démonstration du dispositif Kaaraange"
  ),
  events: m(
    "/images/journey/events.jpeg",
    1080,
    810,
    "Lors d'un événement technologique"
  ),
} as const;

/* ------------------------------------------------------------------ *
 * PROJECTS
 * ------------------------------------------------------------------ */

export const kaaraangeMedia = {
  setup: m(
    "/images/projects/kaaraange/setup.jpeg",
    1280,
    853,
    "Dispositif Kaaraange installé et fonctionnel"
  ),
  team: m(
    "/images/projects/kaaraange/team.jpeg",
    1280,
    853,
    "L'équipe Kaaraange après l'Orange Summer Challenge 2025"
  ),
  build: m(
    "/images/projects/kaaraange/build.jpeg",
    810,
    1080,
    "Construction et câblage du prototype Kaaraange"
  ),
  bench1: m(
    "/images/projects/kaaraange/bench-1.jpeg",
    810,
    1080,
    "Plan de travail : prototypage du système embarqué"
  ),
  bench2: m(
    "/images/projects/kaaraange/bench-2.jpeg",
    810,
    1080,
    "Tests techniques du prototype IoT"
  ),
  bench3: m(
    "/images/projects/kaaraange/bench-3.jpeg",
    810,
    1080,
    "Mise au point du dispositif Kaaraange"
  ),
  /** Cut-out render of the device, transparent background. */
  bin: m(
    "/images/projects/kaaraange/poubelle-kaaraange.png",
    1296,
    1666,
    "Le dispositif Kaaraange, conteneur intelligent de déchets biomédicaux",
    { position: "50% 50%" }
  ),
} as const;

export const tukkiMedia = {
  team: m(
    "/images/projects/tukki/team-code-breakers.jpeg",
    1600,
    1600,
    "L'équipe Code Breakers au Hackathon MIABE 2025",
    { position: "50% 35%" }
  ),
} as const;

/* ------------------------------------------------------------------ *
 * ACHIEVEMENTS — the original documents, untouched
 * ------------------------------------------------------------------ */

export const achievementMedia = {
  orangePrize: m(
    "/images/journey/prix-orange-summer-challenge.png",
    1632,
    862,
    "Prix Orange Summer Challenge 2025 remis pour le projet Kaaraange"
  ),
  /**
   * NOTE ON FILENAMES: `geneva-medal.jpeg` is the file that carries the
   * word "DIPLÔME" on the page (confirmed by OCR of the source scan), and
   * `geneva-certificate.jpeg` is the other Geneva sheet. The two filenames
   * are therefore not reliable descriptions — the `label` on each entry in
   * lib/data.ts is what the site actually shows. Re-check when replacing files.
   */
  genevaCertificate: m(
    "/images/achievements/geneva-certificate.jpeg",
    810,
    1080,
    "Document original — Salon International des Inventions de Genève, médaille d'argent pour Kaaraange"
  ),
  genevaMedal: m(
    "/images/achievements/geneva-medal.jpeg",
    810,
    1080,
    "Diplôme original du Salon International des Inventions de Genève délivré à Pape Djibril SÉNE"
  ),
  eurochamPrize: m(
    "/images/achievements/eurocham-prize.jpeg",
    720,
    1264,
    "Certificat original — Concours Pitch Projets, Premier Prix Eurocham PEPITES, remis par Eurocham Sénégal"
  ),
} as const;

/* ------------------------------------------------------------------ *
 * FLAT INDEX
 *
 * Lets content data (lib/data.ts) reference a photo by a short key instead of
 * a path, so a component never has to know where a file lives.
 * ------------------------------------------------------------------ */

export const mediaIndex = {
  hero: media.hero,
  story: media.story,
  drone: media.drone,
  profile: media.profile,

  presentationUcad: journeyMedia.presentationUcad,
  presentationKaaraange: journeyMedia.presentationKaaraange,
  kaaraangeVisit: journeyMedia.kaaraangeVisit,
  events: journeyMedia.events,

  setup: kaaraangeMedia.setup,
  team: kaaraangeMedia.team,
  build: kaaraangeMedia.build,
  bench1: kaaraangeMedia.bench1,
  bench2: kaaraangeMedia.bench2,
  bench3: kaaraangeMedia.bench3,
  bin: kaaraangeMedia.bin,

  tukkiTeam: tukkiMedia.team,

  genevaCertificate: achievementMedia.genevaCertificate,
  genevaMedal: achievementMedia.genevaMedal,
  eurochamPrize: achievementMedia.eurochamPrize,
  orangePrize: achievementMedia.orangePrize,
} as const;

export type MediaIndexKey = keyof typeof mediaIndex;

export function getMedia(key: MediaIndexKey): MediaItem {
  return mediaIndex[key];
}

export type MediaKey = keyof typeof media;
