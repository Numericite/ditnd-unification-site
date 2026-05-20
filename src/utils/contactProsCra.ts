export const PROFILE_VALUES = ["pro-cra"] as const;
export type Profile = (typeof PROFILE_VALUES)[number];

export const PROFILE_LABELS: Record<Profile, string> = {
	"pro-cra": "Un professionnel de CRA",
};

export const WISH_VALUES = ["newsletter", "propose-content", "other"] as const;
export type Wish = (typeof WISH_VALUES)[number];

export const WISH_LABELS: Record<Wish, string> = {
	newsletter: "Vous inscrire à la newsletter (pour les pros des CRA)",
	"propose-content": "Proposer un contenu",
	other: 'Autre (précisez dans le champ "Votre message")',
};
