import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const WISH_LABELS = {
	newsletter: "Vous inscrire à la newsletter (pour les pros des CRA)",
	"propose-content": "Proposer un contenu",
	other: 'Autre (précisez dans le champ "Votre message")',
} as const;

const PROFILE_LABELS = {
	"pro-cra": "Un professionnel de CRA",
} as const;

const INVALID_MESSAGE_REGEX = /[<>{}[\]\\]/;

const contactProsCraSchema = z.object({
	profile: z.enum(["pro-cra"]),
	firstName: z.string().trim().min(1),
	lastName: z.string().trim().min(1),
	craName: z.string().trim().min(1),
	craRole: z.string().trim().min(1),
	wish: z.enum(["newsletter", "propose-content", "other"]),
	message: z
		.string()
		.trim()
		.min(15)
		.max(1000)
		.refine((val) => !INVALID_MESSAGE_REGEX.test(val), {
			message: "Le message contient des caractères spéciaux non autorisés.",
		}),
	phone: z
		.string()
		.trim()
		.optional()
		.refine((val) => !val || /^\d{10}$/.test(val), {
			message: "Le numéro doit être composé de 10 chiffres.",
		}),
	email: z.string().trim().email(),
});

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
				<h2>Nouveau message du formulaire de contact des</h2>
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
});
