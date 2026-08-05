export type SiteMetric = {
  label: string;
  value: string;
  detail: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
};

export type Competition = {
  title: string;
  summary: string;
  period: string;
  status: "Ouvert" | "À venir" | "En cours";
  format: string;
};

export type Club = {
  name: string;
  city: string;
  venue: string;
  audience: string;
  tables: number;
  contact: string;
};

export type DocumentItem = {
  title: string;
  category: string;
  format: string;
  updatedAt: string;
  description: string;
  href?: string;
};

export type CommitteeMember = {
  name: string;
  role: string;
  initials: string;
  mission: string;
  area: string;
};

export type TechnicalStaffMember = {
  name: string;
  role?: string;
  initials: string;
  mission?: string;
  area?: string;
};

export const siteMetrics: SiteMetric[] = [
  {
    label: "Clubs affiliés",
    value: "24",
    detail: "Un réseau actif entre Reims, Épernay, Vitry et leurs bassins.",
  },
  {
    label: "Licenciés suivis",
    value: "1 860",
    detail: "Vision consolidée pour piloter l'animation sportive et fédérale.",
  },
  {
    label: "Épreuves annuelles",
    value: "38",
    detail: "Compétitions départementales, détections, finales et événements.",
  },
  {
    label: "Documents centralisés",
    value: "120+",
    detail: "Règlements, convocations, formulaires et ressources pratiques.",
  },
];

export const newsArticles: Article[] = [
  {
    slug: "campagne-licences-2026",
    title: "Campagne licences 2026 : calendrier et pièces à anticiper",
    excerpt:
      "Une synthèse claire pour les clubs avant l'ouverture de la nouvelle campagne de réaffiliation et des mutations.",
    category: "Vie fédérale",
    date: "12 avril 2026",
    readTime: "4 min",
    featured: true,
  },
  {
    slug: "criterium-jeunes-reims",
    title: "Critérium jeunes à Reims : forte mobilisation sur le dernier tour",
    excerpt:
      "Le comité dresse un bilan très positif de la journée avec une participation en hausse et un accueil salué.",
    category: "Jeunes",
    date: "08 avril 2026",
    readTime: "3 min",
  },
  {
    slug: "formation-juge-arbitre",
    title: "Nouvelle session de formation juge-arbitre en mai",
    excerpt:
      "Une session courte et opérationnelle pour renforcer l'autonomie d'organisation des clubs sur les rencontres.",
    category: "Formation",
    date: "02 avril 2026",
    readTime: "5 min",
  },
  {
    slug: "appel-a-projets-emploi",
    title: "Accompagnement à l'emploi sportif : ouverture d'un guichet comité",
    excerpt:
      "Le comité propose un premier niveau de cadrage pour aider les structures à sécuriser leurs projets RH.",
    category: "Clubs",
    date: "27 mars 2026",
    readTime: "4 min",
  },
];

export const competitions: Competition[] = [
  {
    title: "Championnat par équipes",
    summary:
      "Feuilles de route, phases, montées-descentes et arbitrage pour les rencontres départementales.",
    period: "Septembre 2025 - Juin 2026",
    status: "En cours",
    format: "Équipes seniors",
  },
  {
    title: "Critérium fédéral",
    summary:
      "Repères pour les engagements, les montées et l'organisation des tours départementaux.",
    period: "4 tours / saison",
    status: "En cours",
    format: "Individuel",
  },
  {
    title: "Coupe et finales départementales",
    summary:
      "Temps forts de fin de saison avec un focus sur la valorisation des clubs organisateurs.",
    period: "Mai - Juin 2026",
    status: "À venir",
    format: "Épreuves finales",
  },
];

export const clubs: Club[] = [
  {
    name: "Reims Olympique TT",
    city: "Reims",
    venue: "Complexe René Tys",
    audience: "Jeunes et compétition",
    tables: 18,
    contact: "contact@reimstt.fr",
  },
  {
    name: "Épernay Ping Horizon",
    city: "Épernay",
    venue: "Halle Pierre Gaspard",
    audience: "Loisir et adultes",
    tables: 12,
    contact: "bureau@epernayping.fr",
  },
  {
    name: "Châlons TT Club",
    city: "Châlons-en-Champagne",
    venue: "Gymnase Tirlet",
    audience: "École de ping",
    tables: 10,
    contact: "secretariat@chalonstt.fr",
  },
  {
    name: "Vitry Sud Marne TT",
    city: "Vitry-le-François",
    venue: "Salle Jean Bernard",
    audience: "Mixte loisirs / compétition",
    tables: 8,
    contact: "club@vitrytt.fr",
  },
  {
    name: "Sézanne Tennis de Table",
    city: "Sézanne",
    venue: "Centre sportif intercommunal",
    audience: "Débutants et famille",
    tables: 7,
    contact: "hello@sezannett.fr",
  },
  {
    name: "Cormontreuil Ping 51",
    city: "Cormontreuil",
    venue: "Espace Coubertin",
    audience: "Compétition régionale",
    tables: 9,
    contact: "admin@cormontreuilping.fr",
  },
];

export const documents: DocumentItem[] = [
  {
    title: "Guide administratif des clubs 2025-2026",
    category: "Gestion club",
    format: "PDF",
    updatedAt: "Avril 2026",
    description:
      "Réaffiliation, assurances, licences et obligations administratives regroupées dans un même document.",
  },
  {
    title: "Formulaire de demande de subvention événementielle",
    category: "Financement",
    format: "DOCX",
    updatedAt: "Mars 2026",
    description:
      "Support standardisé pour accélérer l'instruction des projets d'animation sportive locale.",
  },
  {
    title: "Règlement sportif départemental",
    category: "Règlementation",
    format: "PDF",
    updatedAt: "Février 2026",
    description:
      "Cadre de référence pour les épreuves départementales, l'arbitrage et les réserves.",
  },
  {
    title: "Kit communication rentrée des clubs",
    category: "Communication",
    format: "ZIP",
    updatedAt: "Janvier 2026",
    description:
      "Affiches, visuels réseaux sociaux et messages prêts à diffuser pour booster les inscriptions.",
  },
];

export const committeeMembers: CommitteeMember[] = [
  {
    name: "Claire Morel",
    role: "Présidente",
    initials: "CM",
    mission: "Pilotage stratégique, partenariats institutionnels et gouvernance.",
    area: "Direction",
  },
  {
    name: "Julien Favier",
    role: "Vice-président sportif",
    initials: "JF",
    mission: "Supervision des compétitions, calendrier et coordination des officiels.",
    area: "Sportif",
  },
  {
    name: "Sophie Renard",
    role: "Secrétaire générale",
    initials: "SR",
    mission: "Vie statutaire, convocations et diffusion documentaire.",
    area: "Administration",
  },
  {
    name: "Karim Belaïd",
    role: "Référent développement",
    initials: "KB",
    mission: "Accompagnement des clubs, emploi sportif et projets territoriaux.",
    area: "Développement",
  },
  {
    name: "Élodie Marchal",
    role: "Responsable jeunes",
    initials: "EM",
    mission: "Détection, stages, actions scolaires et passerelles de pratique.",
    area: "Jeunesse",
  },
];

export const actualCommitteeMembers: CommitteeMember[] = [
  {
    name: "ANDRE Blandine",
    role: "Responsable du suivi sportif",
    initials: "AB",
    mission: "Suivi sportif du championnat par équipes (D3, D4, D5).",
    area: "Sportif",
  },
  {
    name: "BARCELO Emmanuel",
    role: "Président",
    initials: "BE",
    mission:
      "Président, assistant du challenge Charles Artaud et des championnats de la Marne vétérans.",
    area: "Direction",
  },
  {
    name: "FILA-TOURNANT Julie",
    role: "Responsable projets associatifs",
    initials: "FJ",
    mission: "Projets associatifs et dossiers de subvention.",
    area: "Projets",
  },
  {
    name: "FRANCOIS Gauthier",
    role: "Assistant compétitions",
    initials: "FG",
    mission: "Assistant du balbutop et du master féminin.",
    area: "Competitions",
  },
  {
    name: "GIORIA Julien",
    role: "Responsable championnat",
    initials: "GJ",
    mission: "Création des poules du championnat par équipes.",
    area: "Sportif",
  },
  {
    name: "GUIRAO Jean-François",
    role: "Assistant critérium fédéral",
    initials: "GJ",
    mission: "Assistant du critérium fédéral.",
    area: "Competitions",
  },
  {
    name: "HAUTIER Jean Marc",
    role: "Responsable jeunes",
    initials: "HJ",
    mission: "Championnat jeunes et calendrier.",
    area: "Jeunesse",
  },
  {
    name: "HOCQUELOUX Thomas",
    role: "Trésorier",
    initials: "HT",
    mission: "Trésorerie du comité.",
    area: "Administration",
  },
  {
    name: "LEGRY Jean-Emmanuel",
    role: "Responsable commission sportive",
    initials: "LJ",
    mission: "Responsable de la commission sportive.",
    area: "Sportif",
  },
  {
    name: "MANGEOT Karelle",
    role: "Secrétaire",
    initials: "MK",
    mission:
      "Challenge Charles Artaud, championnats de la Marne Vétérans et assistance à la gestion de la commission départementale d'arbitrage.",
    area: "Administration",
  },
  {
    name: "MATHIEU Sébastien",
    role: "Responsable commission technique",
    initials: "MS",
    mission: "Responsable de la commission technique.",
    area: "Technique",
  },
  {
    name: "MAUFFRE Hugo",
    role: "Responsable adjoint arbitrage",
    initials: "MH",
    mission: "Responsable adjoint de la commission départementale d'arbitrage.",
    area: "Arbitrage",
  },
  {
    name: "PERRON Alain",
    role: "Vice-Président",
    initials: "PA",
    mission:
      "Vice-Président et responsable de la commission départementale d'arbitrage.",
    area: "Arbitrage",
  },
  {
    name: "RENAUX Régine",
    role: "Assistante compétitions",
    initials: "RR",
    mission:
      "Assistante du critérium fédéral, du championnat jeunes, du balbutop et du master féminin.",
    area: "Competitions",
  },
  {
    name: "SALOMON Thierry",
    role: "Responsable coupe",
    initials: "ST",
    mission: "Responsable de la coupe de la Marne.",
    area: "Competitions",
  },
  {
    name: "SCHUER Cyril",
    role: "Responsable critérium fédéral",
    initials: "SC",
    mission: "Responsable du critérium fédéral.",
    area: "Competitions",
  },
  {
    name: "SOUCHON Pierre-François",
    role: "Médecin",
    initials: "SP",
    mission: "Médecin du comité.",
    area: "Medical",
  },
  {
    name: "VAUCOULEUR Dominique",
    role: "Secrétaire adjointe",
    initials: "VD",
    mission: "Balbutop et master féminin.",
    area: "Administration",
  },
];

export const technicalStaffMembers: TechnicalStaffMember[] = [
  {
    name: "ASENCIO TEIXERA Emil",
    initials: "AE",
  },
  {
    name: "BERTHELOT Maxime",
    initials: "BM",
  },
  {
    name: "GUILLAUMEE Lucas",
    initials: "GL",
  },
  {
    name: "VANTOURS Steven",
    initials: "VS",
  },
];

export const contactChannels = [
  {
    title: "Secrétariat",
    value: "contact@cd51tt.fr",
    description: "Questions administratives, documents et vie statutaire.",
  },
  {
    title: "Pôle sportif",
    value: "sportif@cd51tt.fr",
    description: "Calendriers, compétitions, règlements et arbitrage.",
  },
  {
    title: "Téléphone",
    value: "03 26 00 51 51",
    description: "Du lundi au vendredi, de 9h00 à 17h30.",
  },
];
