export const siteConfig = {
  name: "Comité Départemental de Tennis de Table de la Marne",
  shortName: "CD51TT",
  url: "https://www.cd51tt.fr",
  description:
    "Le site officiel du Comité Départemental de Tennis de Table de la Marne pour suivre l'actualité, les compétitions, les clubs et les ressources utiles du territoire.",
  location: "Maison des Sports, Reims",
  addressLine1: "Maison des Sports",
  addressLine2: "122 bis rue du Barbâtre",
  postalCode: "51100",
  city: "Reims",
  season: "Saison 2025-2026",
  email: "contact@cd51tt.fr",
  phone: "03 26 00 51 51",
  organization: "Association sportive affiliée à la FFTT",
  publicationDirector: "Présidence du CD51TT",
  dataContact: "contact@cd51tt.fr",
};

export const officeHours = [
  "Lundi : 9h00 - 12h30 / 14h00 - 17h30",
  "Mardi : 9h00 - 12h30 / 14h00 - 17h30",
  "Mercredi : 9h00 - 12h30 / 14h00 - 17h30",
  "Jeudi : 9h00 - 12h30 / 14h00 - 17h30",
  "Vendredi : 9h00 - 12h30 / 14h00 - 16h30",
];

export const affiliations = [
  "Fédération Française de Tennis de Table",
  "Ligue Grand Est de Tennis de Table",
  "Comité Départemental Olympique et Sportif de la Marne",
];

export const partners = [
  "Département de la Marne",
  "Agence nationale du Sport",
  "Ville de Reims",
];

export const quickContactLinks = [
  {
    href: "mailto:contact@cd51tt.fr",
    label: "Écrire au comité",
  },
  {
    href: "tel:0326005151",
    label: "Appeler le standard",
  },
  {
    href: "/contact",
    label: "Formulaire de contact",
  },
];

export type NavigationItem = {
  href: string;
  label: string;
  description: string;
  badge?: string;
};

export const mainNavigation: NavigationItem[] = [
  {
    href: "/",
    label: "Accueil",
    description: "Vue d'ensemble du comité",
  },
  {
    href: "/actualites",
    label: "Actualités",
    description: "Vie du comité et annonces",
    badge: "Nouveau",
  },
  {
    href: "/competitions",
    label: "Compétitions",
    description: "Calendriers, phases et résultats",
  },
  {
    href: "/calendrier",
    label: "Calendrier",
    description: "Agenda des échéances sportives",
  },
  {
    href: "/clubs",
    label: "Clubs",
    description: "Annuaire départemental",
  },
  {
    href: "/documents",
    label: "Documents",
    description: "Guides, formulaires et règlements",
  },
  {
    href: "/cadres-techniques",
    label: "Cadres techniques",
    description: "Encadrement technique du comité",
  },
  {
    href: "/comite",
    label: "Comité",
    description: "Gouvernance et commissions",
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Prendre contact avec l'équipe",
  },
];

export const secondaryNavigation: NavigationItem[] = [
  {
    href: "/calendrier",
    label: "Calendrier sportif",
    description: "Épreuves et rendez-vous",
  },
  {
    href: "/documents",
    label: "Base documentaire",
    description: "Téléchargements utiles",
  },
  {
    href: "/clubs",
    label: "Accompagnement clubs",
    description: "Services et réseau",
  },
  {
    href: "/contact",
    label: "Support comité",
    description: "Questions et demandes",
  },
];

export const footerNavigation = {
  comite: [
    { href: "/", label: "Accueil" },
    { href: "/comite", label: "Gouvernance" },
    { href: "/contact", label: "Contact" },
  ],
  activites: [
    { href: "/actualites", label: "Actualités" },
    { href: "/competitions", label: "Compétitions" },
    { href: "/calendrier", label: "Calendrier" },
    { href: "/clubs", label: "Clubs" },
    { href: "/documents", label: "Documents" },
    { href: "/cadres-techniques", label: "Cadres techniques" },
  ],
  institutionnel: [
    { href: "/mentions-legales", label: "Mentions légales" },
    {
      href: "/politique-confidentialite",
      label: "Politique de confidentialité",
    },
  ],
};

export const socialLinks = [
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
  },
];

export const routeCopy = {
  "/": {
    title: "Accueil",
    eyebrow: "Comité départemental",
    description:
      "Le point d'entrée officiel pour suivre la saison, valoriser les clubs et accéder aux informations utiles du tennis de table marnais.",
  },
  "/actualites": {
    title: "Actualités",
    eyebrow: "Informations",
    description:
      "Retrouvez les annonces officielles, les temps forts du comité et les actualités des acteurs du territoire.",
  },
  "/competitions": {
    title: "Compétitions",
    eyebrow: "Calendrier sportif",
    description:
      "Retrouvez les épreuves, les phases en cours et les rendez-vous sportifs qui rythment la saison départementale.",
  },
  "/calendrier": {
    title: "Calendrier",
    eyebrow: "Agenda sportif",
    description:
      "Consultez les journées, convocations, limites d'inscription et résultats publiés par le comité.",
  },
  "/clubs": {
    title: "Clubs",
    eyebrow: "Réseau départemental",
    description:
      "Consultez l'annuaire des structures affiliées et les informations utiles pour orienter les pratiquants dans le département.",
  },
  "/documents": {
    title: "Documents",
    eyebrow: "Ressources",
    description:
      "Accédez aux formulaires, règlements et supports utiles à la vie sportive et administrative des clubs.",
  },
  "/cadres-techniques": {
    title: "Cadres techniques",
    eyebrow: "Encadrement",
    description:
      "Retrouvez les cadres techniques référencés par le comité départemental.",
  },
  "/comite": {
    title: "Comité",
    eyebrow: "Gouvernance",
    description:
      "Présidence, commissions et responsables : une présentation claire de l'organisation du comité départemental.",
  },
  "/contact": {
    title: "Contact",
    eyebrow: "Nous joindre",
    description:
      "Retrouvez les coordonnées, horaires et canaux de contact pour joindre rapidement le comité.",
  },
  "/mentions-legales": {
    title: "Mentions légales",
    eyebrow: "Informations institutionnelles",
    description:
      "Consultez les informations d'identification du site, les responsabilités éditoriales et les repères utiles avant mise en ligne officielle.",
  },
  "/politique-confidentialite": {
    title: "Politique de confidentialité",
    eyebrow: "Protection des données",
    description:
      "Retrouvez les principes de collecte, d'usage et de protection des données personnelles traitées via le site du comité.",
  },
} as const;

export function getRouteDetails(pathname: string) {
  const normalizedPath =
    pathname === "/" ? "/" : `/${pathname.split("/").filter(Boolean)[0]}`;

  return routeCopy[normalizedPath as keyof typeof routeCopy] ?? routeCopy["/"];
}

export function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ href: "/", label: "Accueil" }];
  }

  return [
    { href: "/", label: "Accueil" },
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const details = routeCopy[href as keyof typeof routeCopy];

      return {
        href,
        label: details?.title ?? segment,
      };
    }),
  ];
}
