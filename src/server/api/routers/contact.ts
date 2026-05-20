import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
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
			const recipient = process.env.CONTACT_PARTICULIERS_RECIPIENT;

			if (!recipient) {
				ctx.payload.logger.error(
					"CONTACT_PARTICULIERS_RECIPIENT env var is not set; cannot send contact email",
				);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Email recipient not configured.",
				});
			}

			const civility = input.civility ?? "Non renseigné";
			const departement = input.departement?.trim()
				? input.departement
				: "Non renseigné";
			const sexe = input.sexe ?? "Non renseigné";
			const ageRange = input.ageRange ?? "Non renseigné";
			const newsletter = input.newsletter ? "Oui" : "Non";

			const subject = `[Contact particuliers] ${input.firstName} ${input.lastName} — ${input.objet}`;

			const text = [
				`Civilité : ${civility}`,
				`Nom : ${input.firstName} ${input.lastName}`,
				`Email : ${input.email}`,
				`Département : ${departement}`,
				`Objet de la demande : ${input.objet}`,
				`Classification : ${input.classification}`,
				`Sexe de la personne concernée : ${sexe}`,
				`Tranche d'âge : ${ageRange}`,
				`Inscription à la newsletter : ${newsletter}`,
				"",
				"Message :",
				input.message,
			].join("\n");

			const html = `
				<h2>Nouveau message du formulaire de contact particuliers</h2>
				<ul>
					<li><strong>Civilité :</strong> ${escapeHtml(civility)}</li>
					<li><strong>Nom :</strong> ${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)}</li>
					<li><strong>Email :</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></li>
					<li><strong>Département :</strong> ${escapeHtml(departement)}</li>
					<li><strong>Objet de la demande :</strong> ${escapeHtml(input.objet)}</li>
					<li><strong>Classification :</strong> ${escapeHtml(input.classification)}</li>
					<li><strong>Sexe de la personne concernée :</strong> ${escapeHtml(sexe)}</li>
					<li><strong>Tranche d'âge :</strong> ${escapeHtml(ageRange)}</li>
					<li><strong>Inscription à la newsletter :</strong> ${escapeHtml(newsletter)}</li>
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
					"Failed to send contact-particuliers email",
				);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to send email.",
				});
			}

			return { ok: true };
		}),
});
