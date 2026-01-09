import type {
	Condition,
	Course,
	Persona,
	Theme,
} from "~/payload/payload-types";

export interface AugmentedCourse extends Omit<Course, ""> {
	theme: Theme;
	persona: Persona;
	conditions: Condition;
}
