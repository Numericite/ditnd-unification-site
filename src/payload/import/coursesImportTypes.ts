export type ImportedCourse = {
	id: number;
	title: string;
	filled: string[];
	missingRequired: string[];
	missingOptional: string[];
	warnings: string[];
};

export type RejectedCourse = {
	title: string | null;
	source: string;
	reason: string;
};

export type CoursesImportReport = {
	imported: ImportedCourse[];
	rejected: RejectedCourse[];
};
