import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import { TRPCError } from "@trpc/server";
import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import type { Media } from "~/payload/payload-types";
import SeoMeta from "~/components/ui/SeoMeta";
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

	const metaImageRef = course.meta?.image;
	const metaImageObj =
		metaImageRef && typeof metaImageRef === "object"
			? (metaImageRef as Media)
			: undefined;

	const metaTitle = course.meta?.title?.trim() || course.title;
	const metaDescription =
		course.meta?.description?.trim() || course.description?.trim();
	const metaImage = metaImageObj?.url || course.image?.url || undefined;

	return (
		<>
			<SeoMeta
				title={metaTitle}
				description={metaDescription}
				image={metaImage}
				type="article"
				pathname={`/formations/${course.slug}`}
			/>
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
