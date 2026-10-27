// src/state/state.ts
import { observable } from "@legendapp/state";
import type {
	PersonaTile,
	PersonaTypes,
} from "~/components/HomePage/PersonaTiles";
import type { Home, Newsletter } from "~/payload/payload-types";
import type { NavItem } from "~/utils/menu";

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

export const newsletterCMSStore = observable<Newsletter>();

export const personStore = observable<PersonaTile[]>([]);

export const proStore = observable<PersonaTile[]>([]);

export const footerTitleStore = observable<string>("");

export const menuStore = observable<NavItem[]>([]);

export const chatbotOpenStore = observable<boolean>(false);
