import { TRPCError } from "@trpc/server";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import type { AugmentedPage } from "~/server/api/routers/pages";
import { createTRPCContext } from "~/server/api/trpc";
import type { PageSection } from "~/utils/pages";

export type PageProps =
	| { isNotFound: true }
	| { isNotFound?: false; page: AugmentedPage };

export const getPageServerSideProps =
	(section: PageSection | null): GetServerSideProps<PageProps> =>
	async (ctx) => {
		const slug = ctx.params?.slug;

		if (typeof slug !== "string") {
			ctx.res.statusCode = 404;
			return { props: { isNotFound: true } };
		}

		const caller = createCaller(await createTRPCContext());

		try {
			const page = await caller.page.getBySlug({ slug, section });
			return { props: { page } };
		} catch (error) {
			if (error instanceof TRPCError && error.code === "NOT_FOUND") {
				ctx.res.statusCode = 404;
				return { props: { isNotFound: true } };
			}

			throw error;
		}
	};
