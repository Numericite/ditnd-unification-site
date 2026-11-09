import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	createGravityFormsEntry,
	getGravityFormsConfig,
	toGravityFormsEntry,
} from "~/server/gravityForms";
import { contactParticuliersSchema } from "~/utils/contactParticuliers";
import {
	contactProsCraSchema,
	PROFILE_LABELS,
	WISH_LABELS,
} from "~/utils/contactProsCra";

const escapeHtml = (str: string) =>
	str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

export const contactRouter = createTRPCRouter({
	submitProsCra: publicProcedure
		.input(contactProsCraSchema)
		.mutation(async ({ ctx, input }) => {
			if (input.website && input.website.trim() !== "") {
				ctx.payload.logger.warn(
					{ honeypot: input.website },
					"Contact pros CRA: honeypot filled, dropping submission",
				);
				return { ok: true };
			}

			const recipient = process.env.CONTACT_PROS_CRA_RECIPIENT;

			if (!recipient) {
				ctx.payload.logger.error(
					"CONTACT_PROS_CRA_RECIPIENT env var is not set; cannot send contact email",
				);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Email recipient not configured.",
				});
			}

			const profileLabel = PROFILE_LABELS[input.profile];
			const wishLabel = WISH_LABELS[input.wish];
			const phoneLine = input.phone ? input.phone : "Non renseigné";

			const subject = `[Contact pros CRA] ${input.firstName} ${input.lastName} — ${wishLabel}`;

			const text = [
				`Profil : ${profileLabel}`,
				`Nom : ${input.firstName} ${input.lastName}`,
				`CRA : ${input.craName}`,
				`Fonction : ${input.craRole}`,
				`Demande : ${wishLabel}`,
				`Email : ${input.email}`,
				`Téléphone : ${phoneLine}`,
				"",
				"Message :",
				input.message,
			].join("\n");

			const html = `
				<h2>Nouveau message du formulaire de contact des professionnels des CRA</h2>
				<ul>
					<li><strong>Profil :</strong> ${escapeHtml(profileLabel)}</li>
					<li><strong>Nom :</strong> ${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)}</li>
					<li><strong>CRA :</strong> ${escapeHtml(input.craName)}</li>
					<li><strong>Fonction :</strong> ${escapeHtml(input.craRole)}</li>
					<li><strong>Demande :</strong> ${escapeHtml(wishLabel)}</li>
					<li><strong>Email :</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></li>
					<li><strong>Téléphone :</strong> ${escapeHtml(phoneLine)}</li>
				</ul>
				<h3>Message</h3>
				<p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>
			`;

			try {
				await ctx.payload.sendEmail({
					to: recipient,
					replyTo: input.email,
					subject,
					text,
					html,
				});
			} catch (err) {
				ctx.payload.logger.error(
					{ err },
					"Failed to send contact-pros-cra email",
				);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to send email.",
				});
			}

			return { ok: true };
		}),

	submitParticuliers: publicProcedure
		.input(contactParticuliersSchema)
		.mutation(async ({ ctx, input }) => {
			if (input.website && input.website.trim() !== "") {
				ctx.payload.logger.warn(
					{ honeypot: input.website },
					"Contact particuliers: honeypot filled, dropping submission",
				);
				return { ok: true };
			}

			const config = getGravityFormsConfig();

			if (!config) {
				ctx.payload.logger.error(
					"GRAVITY_FORMS_* env vars are not set; cannot send contact-particuliers entry",
				);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Gravity Forms not configured.",
				});
			}

			try {
				const entryId = await createGravityFormsEntry(
					config,
					toGravityFormsEntry(input),
				);
				ctx.payload.logger.info(
					{ entryId },
					"Contact particuliers: Gravity Forms entry created",
				);
			} catch (err) {
				ctx.payload.logger.error(
					{ err },
					"Failed to create contact-particuliers Gravity Forms entry",
				);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to send message.",
				});
			}

			return { ok: true };
		}),
});
