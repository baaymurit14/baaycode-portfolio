/**
 * BAAYCODE — content layer
 *
 * All copy and content facts live here so the design can be reworked without
 * touching data, and data can be corrected without touching design.
 *
 * RULE FOR THIS FILE: every fact below is real and verifiable. No invented
 * award, date, certification, technology or number. Anything that could not be
 * confirmed is left empty and the UI degrades gracefully instead of lying.
 */

/**
 * Canonical origin. Vercel serves the apex domain through a 308 redirect to
 * `www`, so every canonical, sitemap and structured-data URL must use `www` to
 * avoid pointing search engines at a redirect.
 */
export const siteUrl = "https://www.baaycode.com";

/* ------------------------------------------------------------------ *
 * BRAND
 * ------------------------------------------------------------------ */

export const brand = {
  /** The personal universe / signature. */
  mark: "BAAYCODE",
  /** The person behind it. */
  person: "Pape Djibril SÉNE",
  /** Monogram, used in the navbar and as the favicon mark. */
  monogram: "PDS",
  /** The narrative promise of the whole site. */
  thesis: "From ideas to systems",
  thesisFr: "Des idées aux systèmes",
  tagline:
    "Applications Web · IoT · Cloud · Innovation",
  /**
   * Stated as a direction, not a current title. He is a Full-Stack & IoT
   * developer today; cloud security and DevSecOps are where he is heading.
   */
  direction: "Cloud · Cybersécurité · DevSecOps",
};

export const profile = {
  name: "Pape Djibril SÉNE",
  role: "Développeur Full-Stack & IoT",
  valueProposition:
    "Je conçois des solutions numériques qui transforment des problèmes réels en systèmes intelligents — du capteur au Cloud, de l'interface au déploiement.",
  location: "Dakar, Sénégal",
  email: "pdjibrilmn@gmail.com",
  phone: "+221 77 436 17 67",
  github: "https://github.com/baaymurit14",
  linkedin:
    "https://www.linkedin.com/in/pape-djibril-s%C3%A9ne-a36b6b303/",
  cv: "/CV PAPE DJIBRIL SENE.pdf",
};

export const nav = [
  { id: "hero", label: "Accueil" },
  { id: "story", label: "Histoire" },
  { id: "build", label: "Je construis" },
  { id: "work", label: "Projets" },
  { id: "moments", label: "Moments" },
  { id: "journey", label: "Parcours" },
  { id: "recognition", label: "Distinctions" },
  { id: "capabilities", label: "Compétences" },
  { id: "vision", label: "Vision" },
  { id: "contact", label: "Contact" },
];

/* ------------------------------------------------------------------ *
 * NARRATIVE SPINE — the six movements of the page
 * ------------------------------------------------------------------ */

export const narrative = [
  {
    id: "person",
    index: "01",
    label: "Person",
    fr: "Qui je suis",
    line: "Un développeur qui a commencé par des écrans et a continué jusqu'au matériel.",
  },
  {
    id: "builder",
    index: "02",
    label: "Builder",
    fr: "Ce que je construis",
    line: "Des applications, des systèmes IoT, des pipelines Cloud — la chaîne complète.",
  },
  {
    id: "projects",
    index: "03",
    label: "Projects",
    fr: "Preuves",
    line: "Kaaraange, Tukki, KopparX : des systèmes livrés, testés et présentés.",
  },
  {
    id: "innovation",
    index: "04",
    label: "Innovation",
    fr: "Ce que ça change",
    line: "Transformer un problème de terrain en dispositif mesurable.",
  },
  {
    id: "recognition",
    index: "05",
    label: "Recognition",
    fr: "Ce que ça a rapporté",
    line: "Trois lauréats, une médaille d'argent, une place de finaliste.",
  },
  {
    id: "vision",
    index: "06",
    label: "Vision",
    fr: "Où je vais",
    line: "Cloud, cybersécurité, DevSecOps : sécuriser ce que je construis déjà.",
  },
] as const;

export type NarrativeStep = (typeof narrative)[number];

/* ------------------------------------------------------------------ *
 * STATS
 * ------------------------------------------------------------------ */

export const stats = [
  { value: "4", label: "Projets techniques" },
  { value: "4", label: "Distinctions" },
  { value: "Full-Stack", label: "+ IoT" },
  { value: "Dakar", label: "Sénégal" },
];

/* ------------------------------------------------------------------ *
 * MY STORY — editorial narrative for the B&W portrait section
 * ------------------------------------------------------------------ */

export const story = {
  eyebrow: "My Story",
  heading: ["La technique", "au service", "du terrain"],
  paragraphs: [
    "J'ai commencé par apprendre le web : HTML, CSS, JavaScript, puis PHP et Java. Chaque projet confirmait qu'une théorie devenait un formulaire qui marchait vraiment. C'est ce qui m'a conduit vers l'IoT : voir un capteur, une donnée, une décision, un effet physique.",
    "Kaaraange est la forme complète de cette façon de travailler. Un problème réel — la gestion des déchets biomédicaux — traité comme un système : identifier, tracer, notifier, prouver. Du microcontrôleur jusqu'à l'interface, sans rupture.",
    "Aujourd'hui je travaille sur des applications web et des systèmes IoT branchés au Cloud. Demain, je veux sécuriser cette chaîne : le Cloud et la cybersécurité sont la suite logique de tout ce que je construis déjà.",
  ],
  /**
   * Pulled straight from `lib/data.ts` history so the two can never drift.
   * Factual only.
   */
  facts: [
    { label: "Base", value: "Dakar, Sénégal" },
    { label: "Formation", value: "Licence Développement & Administration Web" },
    { label: "Université", value: "Alioune Diop de Bambey" },
    { label: "Terrain", value: "Compétitions nationales & internationales" },
  ],
  marginNotes: [
    "Systèmes IoT",
    "Full-Stack",
    "Cloud",
  ],
};

/* ------------------------------------------------------------------ *
 * WHAT I BUILD
 * ------------------------------------------------------------------ */

export type BuildCategory = {
  id: string;
  index: string;
  title: string;
  fr: string;
  line: string;
  detail: string;
  /** Inline SVG path key resolved by components/BuildGlyph.tsx */
  glyph: "web" | "iot" | "cloud" | "product" | "prototype";
  accent: "copper" | "signal";
  stack: string[];
};

export const whatIBuild: BuildCategory[] = [
  {
    id: "web",
    index: "01",
    title: "Web Applications",
    fr: "Applications Web",
    line: "Des interfaces qui tiennent la charge réelle.",
    detail:
      "Applications métier complètes : authentification, données, API, interface. Java et Spring Boot côté serveur, React côté client, MySQL et Firebase côté données.",
    glyph: "web",
    accent: "signal",
    stack: ["Java", "Spring Boot", "React", "PHP", "Laravel", "MySQL"],
  },
  {
    id: "iot",
    index: "02",
    title: "IoT Systems",
    fr: "Systèmes IoT",
    line: "Du capteur à la donnée, sans rupture.",
    detail:
      "Capteurs, RFID/NFC, microcontrôleurs et passerelles MQTT. Le dispositif physique et la chaîne logicielle sont conçus ensemble, pas l'un après l'autre.",
    glyph: "iot",
    accent: "signal",
    stack: ["Arduino", "ESP32", "MQTT", "RFID/NFC", "Capteurs"],
  },
  {
    id: "cloud",
    index: "03",
    title: "Cloud Solutions",
    fr: "Solutions Cloud",
    line: "L'infrastructure qui tient la charge.",
    detail:
      "Ingestion d'appareils, stockage et orchestration : AWS IoT Core, DynamoDB, Node-RED pour relier le terrain aux services.",
    glyph: "cloud",
    accent: "signal",
    stack: ["AWS IoT Core", "DynamoDB", "Node-RED"],
  },
  {
    id: "product",
    index: "04",
    title: "Digital Products",
    fr: "Produits numériques",
    line: "Un MVP utile avant un produit fini.",
    detail:
      "De l'idée au MVP : cadrage du besoin, modélisation des données, UX/UI puis développement. KopparX est né de cette méthode.",
    glyph: "product",
    accent: "copper",
    stack: ["React", "Firebase", "UX/UI", "Modélisation"],
  },
  {
    id: "prototype",
    index: "05",
    title: "Technical Prototypes",
    fr: "Prototypes techniques",
    line: "Prouver que ça marche, physiquement.",
    detail:
      "Maquettes fonctionnelles pour valider une idée technique avant d'investir : câblage, capteurs, servo-moteurs, tests en conditions réelles.",
    glyph: "prototype",
    accent: "copper",
    stack: ["ESP32", "Arduino", "Servomoteur", "LCD", "Tinkercad"],
  },
];

/* ------------------------------------------------------------------ *
 * PROJECTS
 * ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  name: string;
  subtitle: string;
  role: string;
  summary: string;
  description: string;
  tech: string[];
  result: string;
  href: string | null;
  featured: boolean;
  /** Key into lib/media.ts's flat index — see `getMedia`. */
  coverKey: "setup" | "team" | "tukkiTeam" | "none";
  /** Editorial numbering shown on the card, e.g. "01" */
  index: string;
  year: string;
};

export const projects: Project[] = [
  {
    slug: "kaaraange",
    index: "01",
    name: "Kaaraange",
    subtitle: "Intelligent Biomedical Waste Management",
    role: "Conception & développement — IoT, Cloud, logiciel",
    summary:
      "Système intelligent de gestion des déchets biomédicaux : tri, identification et ouverture sans contact, connecté au Cloud.",
    description:
      "Kaaraange combine un dispositif physique (capteurs, RFID/NFC, servomoteur, écran LCD) et une chaîne logicielle complète, du microcontrôleur jusqu'à l'interface web, pour sécuriser et fiabiliser la gestion des déchets biomédicaux.",
    tech: [
      "Java",
      "Spring Boot",
      "React",
      "AWS IoT Core",
      "MQTT",
      "Node-RED",
      "DynamoDB",
      "Arduino",
      "ESP32",
      "RFID/NFC",
    ],
    result:
      "Lauréat Orange Summer Challenge 2025 · Médaille d'argent à Genève · Lauréat Eurocham PEPIT",
    href: "/kaaraange",
    featured: true,
    coverKey: "setup",
    year: "2025",
  },
  {
    slug: "tukki",
    index: "02",
    name: "Tukki",
    subtitle: "Mobilité et voyages interurbains au Sénégal",
    role: "Chef de projet & développeur",
    summary:
      "Application de mobilité interurbaine au Sénégal : réservation, planification de voyages et covoiturage.",
    description:
      "Tukki facilite les déplacements entre villes au Sénégal en réunissant réservation, planification d'itinéraires et mise en relation pour le covoiturage sur une seule plateforme.",
    tech: [],
    result: "Finaliste — Hackathon MIABE 2025",
    href: null,
    featured: false,
    coverKey: "tukkiTeam",
    year: "2025",
  },
  {
    slug: "kopparx",
    index: "03",
    name: "KopparX",
    subtitle: "Application de gestion financière",
    role: "Conception MVP, développement, UX/UI, modélisation des données",
    summary:
      "Application de gestion financière pensée pour les jeunes entrepreneurs et salariés.",
    description:
      "KopparX aide les jeunes entrepreneurs et salariés à suivre et organiser leurs finances, du MVP à la modélisation des données jusqu'à l'interface.",
    tech: ["React", "Firebase"],
    result: "MVP conçu et développé",
    href: null,
    featured: false,
    coverKey: "none",
    year: "",
  },
  {
    slug: "ettu-murit-teck",
    index: "04",
    name: "Ëttu-Murit Teck",
    subtitle: "E-commerce dédié aux produits électroniques",
    role: "Développement",
    summary: "Plateforme e-commerce dédiée à la vente de produits électroniques.",
    description:
      "Une plateforme e-commerce construite sur Joomla pour la vente de produits électroniques.",
    tech: ["Joomla"],
    result: "Plateforme e-commerce en ligne",
    href: null,
    featured: false,
    coverKey: "none",
    year: "",
  },
];

/* ------------------------------------------------------------------ *
 * MOMENTS — curated fragments, not a dump of every photo.
 *
 * Spans vary on purpose to build an editorial rhythm. Order is intentional.
 * ------------------------------------------------------------------ */

export type Moment = {
  id: string;
  media:
    | "presentationUcad"
    | "presentationKaaraange"
    | "kaaraangeVisit"
    | "events"
    | "team"
    | "tukkiTeam"
    | "bench1"
    | "build"
    | "drone";
  /** Grid span on desktop. */
  span: "wide" | "tall" | "std";
  /** Context shown on hover / under the caption. */
  context: string;
  caption: string;
  date: string;
  accent: "copper" | "signal";
};

export const moments: Moment[] = [
  {
    id: "m1",
    media: "presentationKaaraange",
    span: "wide",
    context: "Présentation",
    caption: "Kaaraange devant un public",
    date: "2025",
    accent: "signal",
  },
  {
    id: "m2",
    media: "team",
    span: "std",
    context: "Orange Summer Challenge",
    caption: "L'équipe Kaaraange",
    date: "2025",
    accent: "copper",
  },
  {
    id: "m2b",
    media: "tukkiTeam",
    span: "std",
    context: "Hackathon MIABE",
    caption: "L'équipe Code Breakers",
    date: "2025",
    accent: "copper",
  },
  {
    id: "m3",
    media: "bench1",
    span: "tall",
    context: "Labo",
    caption: "Prototypage",
    date: "2025",
    accent: "signal",
  },
  {
    id: "m4",
    media: "presentationUcad",
    span: "std",
    context: "Conférence",
    caption: "Prise de parole",
    date: "2025",
    accent: "copper",
  },
  {
    id: "m5",
    media: "build",
    span: "tall",
    context: "Hardware",
    caption: "Câblage du prototype",
    date: "2025",
    accent: "signal",
  },
  {
    id: "m6",
    media: "events",
    span: "wide",
    context: "Événement",
    caption: "Sur le terrain",
    date: "2025",
    accent: "copper",
  },
  {
    id: "m7",
    media: "kaaraangeVisit",
    span: "std",
    context: "Démonstration",
    caption: "Le dispositif en service",
    date: "2025",
    accent: "signal",
  },
];

/* ------------------------------------------------------------------ *
 * THE JOURNEY — visual timeline
 *
 * Only verified dates. `year` is null when the year is not established, and
 * the timeline renders the label without a year rather than guessing.
 * ------------------------------------------------------------------ */

export type JourneyStop = {
  id: string;
  year: string | null;
  title: string;
  place?: string;
  line: string;
  kind: "education" | "project" | "competition" | "recognition" | "now" | "next";
  /** Optional media key rendered alongside the stop. */
  media?: Moment["media"];
  /** Marks the current position. */
  current?: boolean;
};

export const journey: JourneyStop[] = [
  {
    id: "j1",
    year: "2022",
    title: "Baccalauréat",
    place: "Sciences expérimentales",
    line: "Le point de départ. Baccalauréat S2 obtenu en 2022.",
    kind: "education",
  },
  {
    id: "j2",
    year: null,
    title: "Licence Développement & Administration Web",
    place: "Université Alioune Diop de Bambey",
    line: "La base technique : développement web, administration, bases de données, réseaux.",
    kind: "education",
  },
  {
    id: "j3",
    year: null,
    title: "Premiers projets Full-Stack",
    place: "Web & données",
    line: "KopparX (MVP de gestion financière, React + Firebase) et Ëttu-Murit Teck (e-commerce).",
    kind: "project",
  },
  {
    id: "j4",
    year: "2025",
    title: "Tukki",
    place: "Hackathon MIABE · Finaliste",
    line: "Chef de projet et développeur sur une application de mobilité interurbaine au Sénégal.",
    kind: "competition",
    media: "tukkiTeam",
  },
  {
    id: "j5",
    year: "2025",
    title: "Kaaraange",
    place: "Conception & développement",
    line: "Système IoT de gestion des déchets biomédicaux, du capteur à l'interface web.",
    kind: "project",
    media: "presentationKaaraange",
  },
  {
    id: "j6",
    year: "2025",
    title: "Orange Summer Challenge",
    place: "Lauréat",
    line: "Kaaraange sélectionné parmi les projets de la session 2025.",
    kind: "recognition",
    media: "team",
  },
  {
    id: "j7",
    year: "2025",
    title: "Geneva — Silver Medal",
    place: "51st International Exhibition of Inventions",
    line: "Médaille d'argent pour Kaaraange au salon international des inventions de Genève.",
    kind: "recognition",
  },
  {
    id: "j8",
    year: "2025",
    title: "IoT / Cloud",
    place: "AWS IoT Core · MQTT · DynamoDB",
    line: "La chaîne complète prend forme : objets connectés, messagerie, stockage Cloud.",
    kind: "project",
  },
  {
    id: "j9",
    year: null,
    title: "Aujourd'hui",
    place: "Développeur Full-Stack & IoT",
    line: "Applications web, systèmes IoT et intégration Cloud, à Dakar.",
    kind: "now",
    current: true,
  },
  {
    id: "j10",
    year: null,
    title: "Suite",
    place: brand.direction,
    line: "Cloud, cybersécurité et DevSecOps : sécuriser les systèmes que je construis.",
    kind: "next",
  },
];

/* ------------------------------------------------------------------ *
 * RECOGNITION — the real documents
 * ------------------------------------------------------------------ */

/** One original document, exactly as delivered — never cropped or retouched. */
export type DistinctionDoc = {
  /** Key into lib/media.ts's flat index — see `getMedia`. */
  key: "genevaCertificate" | "genevaMedal" | "eurochamPrize" | "orangePrize";
  /** Which document this is, when an award produced more than one. */
  label: string;
  /** Rotation applied to the document object, in degrees. */
  tilt: number;
  /** How the image fills its plate. Defaults to a cropped cover. */
  fit?: "cover" | "contain";
};

export type Distinction = {
  id: string;
  org: string;
  year: string;
  result: string;
  project: string;
  location?: string;
  href: string | null;
  /**
   * The original document(s) backing this distinction. Empty when no document
   * is in the delivered set — the section then says so rather than substituting
   * an unrelated image.
   */
  docs: DistinctionDoc[];
  note?: string;
};

export const distinctions: Distinction[] = [
  {
    id: "orange",
    org: "Orange Summer Challenge",
    year: "2025",
    result: "Lauréat",
    project: "Kaaraange",
    href: "/kaaraange",
    docs: [{ key: "orangePrize", label: "Prix", tilt: -1.4, fit: "contain" }],
    note: "Projet Kaaraange sélectionné et primé lors de la session 2025.",
  },
  {
    id: "geneva",
    org: "51st International Exhibition of Inventions",
    location: "Genève",
    year: "2025",
    result: "Médaille d'argent",
    project: "Kaaraange",
    href: "/kaaraange",
    docs: [
      { key: "genevaCertificate", label: "Certificat", tilt: -1.8 },
      { key: "genevaMedal", label: "Diplôme", tilt: 1.5 },
    ],
    note: "Salon International des Inventions de Genève — médaille d'argent.",
  },
  {
    id: "eurocham",
    org: "Eurocham PEPIT Sénégal",
    year: "2025",
    result: "Premier prix",
    project: "Kaaraange",
    href: "/kaaraange",
    docs: [{ key: "eurochamPrize", label: "Prix", tilt: 1.4 }],
    note: "Concours Pitch Projets — Prix Eurocham PEPITES.",
  },
  {
    id: "miabe",
    org: "Hackathon MIABE",
    year: "2025",
    result: "Finaliste",
    project: "Tukki",
    href: null,
    docs: [],
    note: "Équipe Code Breakers — projet Tukki, finaliste du Hackathon MIABE 2025.",
  },
];

/* ------------------------------------------------------------------ *
 * CAPABILITIES
 * ------------------------------------------------------------------ */

export type SkillGroup = {
  label: string;
  accent: "copper" | "signal";
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Développement",
    accent: "signal",
    items: ["Java", "Spring Boot", "JavaScript", "React", "PHP", "Laravel", "HTML", "CSS"],
  },
  {
    label: "IoT",
    accent: "signal",
    items: ["Arduino", "ESP32", "MQTT", "RFID/NFC", "Capteurs"],
  },
  {
    label: "Cloud",
    accent: "signal",
    items: ["AWS IoT Core", "DynamoDB", "Node-RED"],
  },
  {
    label: "Data",
    accent: "signal",
    items: ["MySQL", "Oracle", "Firebase", "Supabase"],
  },
  {
    label: "Systems & réseaux",
    accent: "copper",
    items: ["Linux", "TCP/IP", "DNS", "DHCP"],
  },
  {
    label: "Outils",
    accent: "copper",
    items: ["Git", "GitHub", "VS Code", "Figma"],
  },
];

export type Certification = {
  id: string;
  title: string;
  status: "Certified";
  /**
   * Issuing organisation. Intentionally empty.
   *
   * VERIFIED 2026-09-28: every one of the 22 pages of the source document
   * (`Classeur1.pdf`) was extracted and run through OCR. The only documents it
   * contains are the Geneva diploma, the second Geneva sheet and the Eurocham
   * PEPITES certificate. There is no drone certificate in the set, so the
   * issuer cannot be read off any document.
   *
   * Naming an organisation anyway would be a fabricated credential. Fill this
   * in only from the original certificate, then set `issuerVerified: true`.
   * The UI renders nothing in place of an empty issuer rather than a guess.
   */
  issuer: string;
  /** Set to true once `issuer` is filled in; switches the layout. */
  issuerVerified: boolean;
  note: string;
  mediaKey: "drone";
};

export const certifications: Certification[] = [
  {
    id: "drone",
    title: "Drone Piloting",
    status: "Certified",
    issuer: "",
    issuerVerified: false,
    note: "Certificat de pilotage de drone — compétence complémentaire, à côté du développement.",
    mediaKey: "drone",
  },
];

export const education = [
  {
    title: "Licence en Développement et Administration Web",
    place: "Université Alioune Diop de Bambey",
  },
  {
    title: "Baccalauréat S2 — Sciences expérimentales",
    place: "2022",
  },
];

export const involvements = [
  {
    org: "Cyber Tech Squad — Université Alioune Diop de Bambey",
    role: "Chargé de communication",
  },
  {
    org: "NTP Les Pédagogues",
    role: "Chargé de communication, ancien secrétaire général",
  },
];

/* ------------------------------------------------------------------ *
 * VISION
 * ------------------------------------------------------------------ */

export const vision = {
  eyebrow: "Vision",
  heading: ["Sécuriser", "ce que", "je construis"],
  body: "Je construis déjà des systèmes qui touchent au matériel, aux données et au Cloud. La suite naturelle est de les rendre sûrs par conception : infrastructure, sécurité et intégration continue.",
  /**
   * Framed as intent. Nothing here claims he already works as a DevSecOps
   * engineer.
   */
  axes: [
    {
      id: "cloud",
      label: "Cloud",
      line: "Approfondir AWS et l'architecture : conception, coûts, fiabilité.",
    },
    {
      id: "security",
      label: "Cybersécurité",
      line: "Comprendre et réduire la surface d'attaque de ce que je déploie.",
    },
    {
      id: "devsecops",
      label: "DevSecOps",
      line: "Intégrer la sécurité et l'automatisation dans le cycle de développement.",
    },
  ],
  disclaimer:
    "Positionnement actuel : développeur Full-Stack & IoT. Ces axes sont la direction que je prends, pas un titre que je m'attribue.",
};

/* ------------------------------------------------------------------ *
 * CONTACT
 * ------------------------------------------------------------------ */

export const contact = {
  eyebrow: "Contact",
  heading: ["Parlons de", "ce que", "vous construisez"],
  body: "Un projet IoT, une application métier, une idée à valider — écrivez-moi. Je réponds depuis Dakar.",
};

/* ------------------------------------------------------------------ *
 * KAARAANGE — case study content
 *
 * The narrative blocks of the deep-dive, kept here so the page file is only
 * layout. Each block is bound to a photograph so the story and the image can
 * never drift apart.
 * ------------------------------------------------------------------ */

export const kaaraangeCase = {
  slug: "kaaraange",
  index: "01",
  name: "Kaaraange",
  subtitle: "Intelligent Biomedical Waste Management",
  sector: "Santé · Déchets biomédicaux · IoT",
  year: "2025",

  overview: {
    label: "Overview",
    heading:
      "Système intelligent de gestion des déchets biomédicaux : tri, identification et ouverture sans contact, connecté au Cloud.",
    body: [
      "Kaaraange combine un dispositif physique (capteurs, RFID/NFC, servomoteur, écran LCD) et une chaîne logicielle complète, du micro-contrôleur jusqu'à l'interface web, pour sécuriser et fiabiliser la gestion des déchets biomédicaux.",
    ],
  },

  problem: {
    label: "The Problem",
    heading:
      "La gestion des déchets biomédicaux reste largement manuelle, non sécurisée et difficile à tracer.",
    body: [
      "Dans les établissements de santé, le tri des déchets biomédicaux est un enjeu critique de sécurité. Les erreurs de tri — un scalpel jeté dans le mauvais conteneur, des gants mêlés à des déchets non dangereux — constituent un risque direct pour le personnel soignant et l'environnement.",
      "Les solutions existantes sont souvent coûteuses, complexes à déployer ou inadaptées aux contraintes des structures de santé dans les pays en développement : alimentation électrique instable, connectivité limitée, manque de personnel formé aux outils numériques.",
      "Kaaraange est né de cette problématique : comment concevoir un système intelligent, abordable et fiable qui sécurise la gestion des déchets biomédicaux du point de collecte jusqu'au suivi cloud ?",
    ],
    /** Media key for the photograph that opens the problem. */
    media: "build" as const,
  },

  solution: {
    label: "The Solution",
    heading:
      "Un dispositif physique connecté : identification sans contact, ouverture automatique, traçabilité cloud en temps réel.",
    body: [
      "Kaaraange combine un boîtier physique équipé de capteurs, d'un lecteur RFID/NFC et d'un servomoteur, relié à une chaîne logicielle complète : du micro-contrôleur jusqu'à l'interface web de suivi.",
      "L'utilisateur badge sa carte RFID sur le dispositif. Le système identifie le type de déchet, valide le tri, ouvre automatiquement le couvercle du bon conteneur et enregistre l'événement dans le cloud. Un écran LCD offre un retour visuel immédiat.",
      "Chaque interaction est tracée : qui, quoi, quand, où. Les données remontent en temps réel via MQTT vers AWS IoT Core, permettant un tableau de suivi pour les responsables hospitaliers et les autorités sanitaires.",
    ],
    flow: [
      {
        step: "01",
        title: "Identification",
        desc: "L'utilisateur présente sa carte RFID/NFC au lecteur du dispositif.",
      },
      {
        step: "02",
        title: "Validation",
        desc: "Le système identifie le type de déchet et valide le tri selon les protocoles biomédicaux.",
      },
      {
        step: "03",
        title: "Ouverture",
        desc: "Le servomoteur ouvre automatiquement le couvercle du conteneur correspondant. L'écran LCD confirme l'opération.",
      },
      {
        step: "04",
        title: "Traçabilité",
        desc: "L'événement est publié via MQTT vers AWS IoT Core et enregistré dans DynamoDB pour suivi et audit.",
      },
    ],
  },

  architecture: {
    label: "System Architecture",
    heading: "Une architecture en couches, du capteur au cloud.",
    body: "De la collecte physique à la visualisation, chaque couche du système a un rôle précis. Les données circulent de bas en haut, de la périphérie matérielle jusqu'à l'interface de suivi.",
    layers: [
      { label: "Capteurs / Hardware", sub: "Capteurs · RFID/NFC · Servomoteur · Écran LCD" },
      { label: "Arduino / ESP32", sub: "Acquisition & contrôle" },
      { label: "MQTT", sub: "Messagerie IoT légère" },
      { label: "AWS IoT Core", sub: "Ingestion & gestion des appareils" },
      { label: "Backend / Services", sub: "Spring Boot · API" },
      { label: "DynamoDB", sub: "Stockage en base NoSQL" },
      { label: "Interface React", sub: "Tableau de suivi & visualisation" },
    ],
    /** Cut-out render of the device shown beside the diagram. */
    media: "bin" as const,
  },

  hardware: {
    label: "Hardware",
    heading: "La couche physique, le cœur du dispositif.",
    items: [
      { name: "Arduino", role: "Micro-contrôleur principal" },
      { name: "ESP32", role: "Connectivité Wi-Fi / Bluetooth" },
      { name: "RFID/NFC", role: "Identification sans contact" },
      { name: "Capteurs", role: "Détection du type de déchet" },
      { name: "Servomoteur", role: "Ouverture automatique du couvercle" },
      { name: "Écran LCD", role: "Retour visuel à l'utilisateur" },
    ],
    note: "Références et modèles exacts selon les plans d'intégration du prototype — à compléter au fil des itérations.",
    media: ["bench1", "bench2", "bench3"] as const,
  },

  cloud: {
    label: "IoT & Cloud",
    heading: "La liaison qui fait circuler les données en temps réel.",
    items: [
      {
        name: "MQTT",
        role: "Protocole de messagerie léger et économe, idéal pour l'IoT et les liaisons à bande passante limitée.",
      },
      {
        name: "Node-RED",
        role: "Orchestration des flux : réception, transformation et routage des messages vers les services.",
      },
      {
        name: "AWS IoT Core",
        role: "Gestion des appareils, authentification et ingestion sécurisée des messages à grande échelle.",
      },
      {
        name: "DynamoDB",
        role: "Base NoSQL serverless qui stocke chaque événement pour le suivi, l'historique et l'audit.",
      },
    ],
  },

  backend: {
    label: "Backend",
    heading: "La logique métier et l'API.",
    body: [
      "Le backend, construit en Java avec Spring Boot, expose une API REST qui sert de pont entre le cloud IoT et l'interface de suivi.",
      "Il prend en charge l'authentification, la logique métier du tri et la restitution des données enregistrées dans DynamoDB, afin de fournir aux responsables hospitaliers une lecture claire et exploitable des événements.",
    ],
  },

  frontend: {
    label: "Frontend",
    heading: "Une interface pour lire et piloter le système.",
    body: [
      "L'interface React rend les données du système visibles et exploitables : suivi des dépôts, statut des conteneurs, historique des événements et indicateurs de remplissage.",
      "Le tableau de bord transforme la traçabilité collectée côté cloud en un outil de pilotage concret pour les équipes de santé et les autorités.",
    ],
    media: "kaaraangeVisit" as const,
  },

  results: {
    label: "Results",
    heading: "Un système fonctionnel, pensé pour les réalités du terrain.",
    stats: [
      { value: "3", label: "Distinctions pour Kaaraange" },
      { value: "1", label: "Médaille d'argent — Genève" },
      { value: "Temps réel", label: "Traçabilité des événements" },
    ],
    media: "presentationKaaraange" as const,
  },

  recognition: {
    label: "Recognition",
    heading: "Reconnu par des jurys nationaux et internationaux.",
    body: "Trois distinctions en 2025 pour Kaaraange. Les documents originaux sont présentés ci-dessous, sans modification.",
  },

  /** Closing gallery — the remaining frames, in narrative order. */
  gallery: [
    { key: "setup" as const, context: "Dispositif", caption: "Le système en service" },
    { key: "build" as const, context: "Hardware", caption: "Câblage du prototype" },
    { key: "bench1" as const, context: "Labo", caption: "Prototypage" },
    { key: "bench2" as const, context: "Tests", caption: "Essais techniques" },
    { key: "bench3" as const, context: "Itération", caption: "Mise au point" },
    { key: "kaaraangeVisit" as const, context: "Démonstration", caption: "Démonstration sur site" },
  ],
};

/* ------------------------------------------------------------------ *
 * SEO
 * ------------------------------------------------------------------ */

export const seo = {
  title: "Pape Djibril SÉNE — Développeur Full-Stack & IoT | BAAYCODE",
  description:
    "Portfolio de Pape Djibril SÉNE, développeur Full-Stack & IoT à Dakar : applications web, systèmes IoT et solutions Cloud. Découvrez Kaaraange et mes projets.",
  locale: "fr_FR",
  twitterCreator: undefined as string | undefined,
};
