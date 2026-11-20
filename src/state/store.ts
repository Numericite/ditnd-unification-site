// src/state/state.ts
import { observable } from "@legendapp/state";
import type {
	PersonaTile,
	PersonaTypes,
} from "~/components/HomePage/PersonaTiles";
import type { Home } from "~/payload/payload-types";
import {
	LOCKED_MENU_ITEMS,
	type LockedMenuItem,
	type NavItem,
	type NavLink,
} from "~/utils/menu";
import { DEFAULT_CONTACT_PATH } from "~/utils/pages";

export type TDH = {
	id?: number;
	name: string;
	description: string;
	acronym: string;
	slug: string;
	display: PersonaTypes;
};

export const tdhStore = observable<TDH[]>([]);

export const homeCMSStore = observable<Home>();

export const personStore = observable<PersonaTile[]>([]);

export const proStore = observable<PersonaTile[]>([]);

export const footerTitleStore = observable<string>("");

export const footerLinksStore = observable<NavLink[]>([]);

export const menuStore = observable<NavItem[]>([]);

export const lockedMenuStore = observable<LockedMenuItem[]>(LOCKED_MENU_ITEMS);

export const contactPathStore = observable<string>(DEFAULT_CONTACT_PATH);

export const chatbotOpenStore = observable<boolean>(false);
