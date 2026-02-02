// src/state/state.ts
import { observable } from "@legendapp/state";
import type { PersonaTypes } from "~/components/HomePage/PersonaTiles";
import type { Home } from "~/payload/payload-types";

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
