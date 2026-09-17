import { fr } from "@codegouvfr/react-dsfr";
import { Follow, type FollowProps } from "@codegouvfr/react-dsfr/Follow";
import { type FormEvent, useState } from "react";
import Honeypot from "~/components/ui/Honeypot";
import { api } from "~/utils/api";
import { HONEYPOT_FIELD_NAME } from "~/utils/contactForm";
import { newsletterSubscribeSchema } from "~/utils/newsletter";
import { newsletterCMSStore } from "~/state/store";

const NETWORK_ERROR =
	"Une erreur est survenue, votre inscription n'a pas pu être enregistrée. Veuillez réessayer plus tard.";

export default function NewsletterFollow() {
	const newsletterCMS = newsletterCMSStore.get();

	const subscribeMutation = api.newsletter.subscribe.useMutation();

	const [email, setEmail] = useState("");
	const [honeypot, setHoneypot] = useState("");
	const [error, setError] = useState<string | undefined>(undefined);
	const [success, setSuccess] = useState(false);

	if (!newsletterCMS?.enabled) return null;

	const socialButtons = (newsletterCMS.socials ?? []).map((social) => ({
		type: social.type as FollowProps.SocialType,
		linkProps: { href: social.url },
	}));

	const social: FollowProps.Social | undefined =
		socialButtons.length > 0
			? {
					title: newsletterCMS.socialTitle || undefined,
					buttons: socialButtons as [
						FollowProps.SocialButton,
						...FollowProps.SocialButton[],
					],
				}
			: undefined;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const parsed = newsletterSubscribeSchema.safeParse({
			email,
			website: honeypot,
		});

		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? NETWORK_ERROR);
			return;
		}

		setError(undefined);

		try {
			await subscribeMutation.mutateAsync(parsed.data);
			setSuccess(true);
			setEmail("");
		} catch {
			setError(NETWORK_ERROR);
		}
	};

	return (
		<Follow
			className={fr.cx("fr-py-6w")}
			newsletter={{
				title: newsletterCMS.title || undefined,
				desc: newsletterCMS.description || undefined,
				buttonProps: {
					type: "submit",
					disabled: subscribeMutation.isPending,
				},
				form: {
					success,
					consentHint: newsletterCMS.consentHint || undefined,
					formComponent: ({ children }) => (
						<form onSubmit={handleSubmit} noValidate>
							{children}
							<Honeypot
								name={HONEYPOT_FIELD_NAME}
								value={honeypot}
								onChange={setHoneypot}
							/>
						</form>
					),
					inputProps: {
						state: error ? "error" : "default",
						stateRelatedMessage: error,
						nativeInputProps: {
							value: email,
							onChange: (event) => setEmail(event.currentTarget.value),
							required: true,
							disabled: subscribeMutation.isPending,
						},
					},
				},
			}}
			social={social}
		/>
	);
}
