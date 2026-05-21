import Avatar from "@codegouvfr/react-dsfr/picto/Avatar";
import CityHall from "@codegouvfr/react-dsfr/picto/CityHall";
import Companie from "@codegouvfr/react-dsfr/picto/Companie";
import Ecosystem from "@codegouvfr/react-dsfr/picto/Ecosystem";
import Hospital from "@codegouvfr/react-dsfr/picto/Hospital";
import HumanCooperation from "@codegouvfr/react-dsfr/picto/HumanCooperation";
import School from "@codegouvfr/react-dsfr/picto/School";
import SelfTraining from "@codegouvfr/react-dsfr/picto/SelfTraining";

import type { PersonaTile } from "~/components/HomePage/PersonaTiles";

export const pictogramMap = {
	Avatar,
	HumanCooperation,
	CityHall,
	SelfTraining,
	Hospital,
	School,
	Companie,
	Ecosystem,
};

export type PictogramName = keyof typeof pictogramMap;

export const personsAndProTiles = (personas: PersonaTile[]) => {
	const mapped = personas.map((persona) => ({
		...persona,
		name: `Je suis ${persona.displayName ?? persona.name}`,
	}));

	return mapped;
};
