import type { PayloadRequest } from "payload";

// Without serverURL, Payload's default email falls back to a relative link that mail clients cannot open.
const siteOrigin = (req?: PayloadRequest) => {
	if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
	const host = req?.headers.get("x-forwarded-host") ?? req?.headers.get("host");
	const protocol =
		req?.headers.get("x-forwarded-proto") ??
		(req?.url ? new URL(req.url).protocol.replace(":", "") : "https");
	return `${protocol}://${host}`;
};

export const forgotPasswordEmailSubject = () =>
	"Réinitialisation de votre mot de passe - Maison de l'autisme";

export const forgotPasswordEmailHTML = (args?: {
	req?: PayloadRequest;
	token?: string;
}) => {
	const origin = siteOrigin(args?.req);
	const url = `${origin}/admin/reset/${args?.token}`;

	return `<!doctype html>
<html lang="fr">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Réinitialisation de votre mot de passe</title>
	</head>
	<body style="margin:0;padding:0;background-color:#f6f6f6;font-family:Marianne,Arial,sans-serif;color:#161616;">
		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f6;">
			<tr>
				<td align="center" style="padding:32px 16px;">
					<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-top:4px solid #000091;">
						<tr>
							<td style="padding:24px 32px;border-bottom:1px solid #dddddd;">
								<table role="presentation" cellpadding="0" cellspacing="0">
									<tr>
										<td style="padding-right:16px;vertical-align:middle;">
											<img src="${origin}/reseau-tnd-logo.png" alt="Réseau TND" width="60" height="66" style="display:block;border:0;" />
										</td>
										<td style="vertical-align:middle;">
											<p style="margin:0;font-size:20px;font-weight:bold;color:#000091;">Maison de l'autisme</p>
											<p style="margin:4px 0 0;font-size:14px;color:#666666;">Espace d'administration</p>
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td style="padding:32px;font-size:16px;line-height:24px;">
								<h1 style="margin:0 0 24px;font-size:24px;line-height:32px;color:#161616;">Réinitialisation de votre mot de passe</h1>
								<p style="margin:0 0 16px;">Bonjour,</p>
								<p style="margin:0 0 16px;">Une demande de réinitialisation du mot de passe de votre compte a été effectuée.</p>
								<p style="margin:0 0 24px;">Pour choisir un nouveau mot de passe, cliquez sur le bouton ci-dessous. Ce lien est valable 1 heure.</p>
								<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
									<tr>
										<td style="background-color:#000091;">
											<a href="${url}" style="display:inline-block;padding:12px 24px;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Réinitialiser mon mot de passe</a>
										</td>
									</tr>
								</table>
								<p style="margin:0 0 8px;font-size:14px;color:#666666;">Si le bouton ne fonctionne pas, copiez cette adresse dans votre navigateur :</p>
								<p style="margin:0 0 24px;font-size:14px;word-break:break-all;"><a href="${url}" style="color:#000091;">${url}</a></p>
								<p style="margin:0;font-size:14px;color:#666666;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre mot de passe restera inchangé.</p>
							</td>
						</tr>
						<tr>
							<td style="padding:16px 32px;background-color:#eeeeee;font-size:12px;line-height:18px;color:#666666;">
								Cet e-mail a été envoyé automatiquement, merci de ne pas y répondre.
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>`;
};
