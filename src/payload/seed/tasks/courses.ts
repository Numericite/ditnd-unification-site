import type { Payload } from "payload";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import type { CourseFormat } from "~/utils/courses";
import { CoursesContent } from "~/utils/wysiwyg-content-courses";

const courses = [
	{
		title: "Comprendre le TSA chez l'enfant",
		description:
			"Les bases pour reconnaître les particularités du TSA et mieux comprendre les besoins de son enfant.",
		link: "https://lien-vers-site.com",
		themes: [1],
		persona: [1],
		conditions: [4],
		format: "dist" as CourseFormat,
	},
	{
		title: "Développement et manifestations selon l'âge",
		description:
			"Comment le TSA peut apparaître différemment chez un jeune enfant, un adolescent ou un adulte.",
		link: "https://lien-vers-site.com",
		themes: [1],
		persona: [1],
		conditions: [4],
		format: "pres" as CourseFormat,
	},
	{
		title: "Repérage précoce : signes à observer",
		description:
			"Des repères pour identifier des signaux d'alerte tout en évitant le surdiagnostic.",
		link: "https://lien-vers-site.com",
		themes: [2],
		persona: [1],
		conditions: [1],
		format: "dist" as CourseFormat,
	},
];

async function createCourse(
	payload: Payload,
	data: {
		title: string;
		description: string;
		link: string;
		themes: number[];
		persona: number[];
		conditions: number[];
		format: CourseFormat;
		content: DefaultTypedEditorState;
	},
): Promise<void> {
	try {
		await payload.create({
			collection: "courses",
			data: { ...data, slug: "", _status: "published" },
			draft: false,
		});
	} catch (error) {
		throw new Error(`Error creating course "${data.title}": ${error}`);
	}
}

export async function seedCourses(payload: Payload) {
	for (let i = 0; i < courses.length; i++) {
		const course = courses[i];
		const content = CoursesContent[i];

		if (!course) {
			throw new Error(`Missing course at index ${i}`);
		}

		if (!content) {
			throw new Error(`Missing content at index ${i}`);
		}

		await createCourse(payload, { ...course, content });
	}
}
