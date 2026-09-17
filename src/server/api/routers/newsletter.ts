import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { newsletterSubscribeSchema } from "~/utils/newsletter";

const BREVO_DOI_ENDPOINT =
	"https://api.brevo.com/v3/contacts/doubleOptinConfirmation";

type BrevoError = { code?: string; message?: string };

export const newsletterRouter = createTRPCRouter({
	subscribe: publicProcedure
		.input(newsletterSubscribeSchema)
		.mutation(async ({ ctx, input }) => {
			if (input.website && input.website.trim() !== "") {
				ctx.payload.logger.warn(
					{ honeypot: input.website },
					"Newsletter: honeypot filled, dropping submission",
				);
				return { ok: true };
			}

			const apiKey = process.env.BREVO_API_KEY;
			const listId = Number(process.env.BREVO_LIST_ID);
			const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
			const redirectionUrl = process.env.BREVO_DOI_REDIRECT_URL;

			if (!apiKey || !listId || !templateId || !redirectionUrl) {
				ctx.payload.logger.error(
					"Brevo newsletter is not configured (BREVO_API_KEY, BREVO_LIST_ID, BREVO_DOI_TEMPLATE_ID, BREVO_DOI_REDIRECT_URL)",
				);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Newsletter provider not configured.",
				});
			}

			let response: Response;
			try {
				response = await fetch(BREVO_DOI_ENDPOINT, {
					method: "POST",
					headers: {
						"api-key": apiKey,
						"content-type": "application/json",
						accept: "application/json",
					},
					body: JSON.stringify({
						email: input.email,
						includeListIds: [listId],
						templateId,
						redirectionUrl,
					}),
				});
			} catch (err) {
				ctx.payload.logger.error({ err }, "Brevo newsletter request failed");
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Newsletter provider unreachable.",
				});
			}

			if (response.ok) return { ok: true };

			const body = (await response.json().catch(() => ({}))) as BrevoError;

			// Already subscribed: nothing to do, and we must not disclose it.
			if (body.code === "duplicate_parameter") return { ok: true };

			ctx.payload.logger.error(
				{ status: response.status, code: body.code, message: body.message },
				"Brevo newsletter subscription rejected",
			);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Newsletter subscription failed.",
			});
		}),
});
