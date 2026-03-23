import type { BasePayload } from "payload";

export default async function homeTask(payload: BasePayload) {
  await payload.updateGlobal({
    slug: "home",
    data: {
      header: {
        title:
          "Plateforme nationale du TSA et des troubles du neuro-développement",
        description:
          "La plateforme nationale au service des personnes concernées par un trouble du neurodéveloppement.",
      },
      tiles: {
        description: "Découvrez les parcours personnalisés selon votre profil.",
      },
      mostViewedGuides: {
        title: "Fiches pratiques les plus lues",
        description:
          "Consultez les guides les plus populaires de notre communauté.",
      },
    },
  });

  payload.logger.info("Home content seeded successfully");
}
