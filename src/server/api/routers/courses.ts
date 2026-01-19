import type {
	Condition,
	Course,
	Persona,
	Theme,
} from "~/payload/payload-types";

export interface AugmentedCourse extends Course {
	theme: Theme;
	persona: Persona;
	condition: Condition;
}
