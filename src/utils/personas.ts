import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import {
	Avatar,
	HumanCooperation,
	CityHall,
	SelfTraining,
} from "@codegouvfr/react-dsfr/picto";

export const personas: PersonaTile[] = [
	{
		name: "Je suis une personne concernée",
		description: "Description type",
		slug: "pe",
		display: "person",
	},
	{
		name: "Je suis un parent proche",
		description: "Description type",
		slug: "pp",
		display: "person",
	},
	{
		name: "Je suis un professionnel",
		description: "Description type",
		slug: "professional",
		display: "professional",
	},
	{
		name: "Grand Public",
		description: "Description type",
		slug: "gp",
		display: "person",
	},
];

export const getPictoByPersonaSlug = (slug: string) => {
	switch (slug) {
		case "pe":
			return Avatar;
		case "pp":
			return HumanCooperation;
		case "professional":
			return CityHall;
		case "gp":
			return SelfTraining;
		default:
			return Avatar;
	}
};
