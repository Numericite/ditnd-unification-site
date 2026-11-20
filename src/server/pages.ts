import { TRPCError } from "@trpc/server";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { createCaller } from "~/server/api/root";
import type { AugmentedPage } from "~/server/api/routers/pages";
import { createTRPCContext } from "~/server/api/trpc";
import { legacyRedirect } from "~/server/redirects";
import type { PageSection } from "~/payload/payload-types";

export type SectionLink = { title: string; href: string };

export type PageProps =
	| { isNotFound: true }
	| { isNotFound?: false; kind: "page"; page: AugmentedPage }
	| {
			isNotFound?: false;
			kind: "section";
			section: PageSection;
			links: SectionLink[];
	  };

const isNotFoundError = (error: unknown) =>
	error instanceof TRPCError && error.code === "NOT_FOUND";

const notFound = async (ctx: GetServerSidePropsContext) => {
	const redirect = await legacyRedirect(ctx.resolvedUrl);
	if (redirect) return redirect;

	ctx.res.statusCode = 404;
	return { props: { isNotFound: true } as const };
};

/** `/{slug}` : une page à la racine, sinon la page d'une rubrique. */
export const getRootServerSideProps: GetServerSideProps<PageProps> = async (
	ctx,
) => {
	const slug = ctx.params?.slug;
	if (typeof slug !== "string") return notFound(ctx);

	const caller = createCaller(await createTRPCContext());

	try {
		const page = await caller.page.getBySlug({ slug, section: null });
		return { props: { kind: "page", page } };
	} catch (error) {
		if (!isNotFoundError(error)) throw error;
	}

	try {
		const { section, links } = await caller.page.getSection({ slug });
		return { props: { kind: "section", section, links } };
	} catch (error) {
		if (!isNotFoundError(error)) throw error;
	}

	return notFound(ctx);
};

/** `/{rubrique}/{slug}` : une page rangée dans une rubrique. */
export const getSectionPageServerSideProps: GetServerSideProps<
	PageProps
> = async (ctx) => {
	const section = ctx.params?.slug;
	const slug = ctx.params?.page;
	if (typeof section !== "string" || typeof slug !== "string") {
		return notFound(ctx);
	}

	const caller = createCaller(await createTRPCContext());

	try {
		const page = await caller.page.getBySlug({ slug, section });
		return { props: { kind: "page", page } };
	} catch (error) {
		if (!isNotFoundError(error)) throw error;
	}

	return notFound(ctx);
};
