import type { MenuProps } from "@codegouvfr/react-dsfr/MainNavigation/Menu";
import { PersonaMenuLink } from "../ui/HomePage/PersonaMenuLink";

const personaMenu = [
  {
    title: "Une personne concernée par",
    description: "Description personne concernée",
    href: "#",
    icon: "fr-icon-user-line",
  },
  {
    title: "Un parent ou un proche intéressé par",
    description: "Description parent ou un proche",
    href: "#",
    icon: "fr-icon-parent-line",
  },
  {
    title: "Un professionnel intéressé par",
    description: "Description professionnel",
    href: "#",
    icon: "fr-icon-briefcase-line",
  },
  {
    title: "Autres",
    description: "Autres Description",
    href: "#",
    icon: "fr-icon-team-line",
  },
];

export const PersonaMenu: MenuProps.Link[] = personaMenu.map((persona) => ({
  linkProps: { href: persona.href },
  text: (
    <PersonaMenuLink
      title={persona.title}
      description={persona.description}
      icon={persona.icon}
    />
  ),
}));
