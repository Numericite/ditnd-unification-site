import type { TextFieldSingleValidation } from "payload";
import { isDsfrIconId } from "../generated/dsfrIcons";

/**
 * Seules les icônes du catalogue DSFR sont livrées dans le CSS du site : toute autre
 * valeur s'afficherait comme un carré vide côté public.
 */
export const validateDsfrIconId: TextFieldSingleValidation = (value) => {
	if (!value) return true;
	if (isDsfrIconId(value)) return true;
	return `"${value}" ne fait pas partie du catalogue d'icônes DSFR. Sélectionnez une icône dans la liste.`;
};
