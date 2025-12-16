// src/state/state.ts
import { observable } from "@legendapp/state";

export type TDH = {
  id?: number;
  name: string;
  description: string;
  acronym: string;
  slug: string;
};

export const tdhStore = observable<TDH[]>([]);
