import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import { TRPCError } from "@trpc/server";
import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import PageContent from "~/components/ui/PageContent";
import CourseDisplay from "~/components/Courses/CourseDisplay";
import ErrorPage from "~/components/ui/ErrorPage/ErrorPage";

type Props =
	| { isNotFound: true }
	| {
			isNotFound?: false;
			course: AugmentedCourse;
	  };

export default function CoursePage(props: Props) {
	if (props.isNotFound) {
		return (
			<>
				<Head>
					<title>Page non trouvée - Maison de l'autisme</title>
					<meta name="robots" content="noindex" />
				</Head>
				<ErrorPage />
			</>
		);
	}

	const { course } = props;

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
		ctx.res.statusCode = 404;
		return { props: { isNotFound: true } };
	}

	const caller = createCaller(await createTRPCContext());

	try {
		const course = await caller.course.getBySlug({ slug });

		return { props: { course } };
	} catch (error) {
		if (error instanceof TRPCError && error.code === "NOT_FOUND") {
			ctx.res.statusCode = 404;
			return { props: { isNotFound: true } };
		}

		throw error;
	}
};
