import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import PageContent from "~/components/ui/PageContent";
import CourseDisplay from "~/components/Courses/CourseDisplay";

type Props = {
	course: AugmentedCourse;
};

export default function CoursePage({ course }: Props) {
	return (
		<>
			<Head>
				<title>{`${course.title} - Maison de l'autisme`}</title>
				<meta name="description" content={course.description} />
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-8w")}>
				<Breadcrumb
					currentPageLabel={course.title}
					homeLinkProps={{ href: "/" }}
					segments={[
						{
							label: "Formations",
							linkProps: { href: "/formations" },
						},
					]}
				/>
				<PageContent>
					<CourseDisplay course={course} />
				</PageContent>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const slug = ctx.params?.slug as string | undefined;

	if (!slug) {
		return { notFound: true };
	}

	const caller = createCaller(await createTRPCContext());

	try {
		const course = await caller.course.getBySlug({ slug });

		if (!course) {
			return { notFound: true };
		}

		return { props: { course } };
	} catch {
		return { notFound: true };
	}
};
