import { fr, type FrIconClassName } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { tss } from "tss-react/dsfr";

type SocialProps = {
	icon: FrIconClassName;
	onClick: () => void;
	title: string;
};

const socials: SocialProps[] = [
	{
		icon: "fr-icon-facebook-circle-line",
		onClick: () => {},
		title: "Lien Facebook",
	},
	{
		icon: "fr-icon-twitter-x-line",
		onClick: () => {},
		title: "Lien X",
	},
	{
		icon: "fr-icon-linkedin-box-line",
		onClick: () => {},
		title: "Lien LinkedIn",
	},
	{
		icon: "fr-icon-mail-line",
		onClick: () => {
			location.href = "mailto:";
		},
		title: "Lien Outlook",
	},
	{
		icon: "fr-icon-links-line",
		onClick: () => {
			navigator.clipboard.writeText(location.href.replace(/#.*$/, ""));
			alert("Adresse copié dans le presse papier");
		},
		title: "Copier le lien",
	},
];

export default function ShareSocials() {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.buttonContainer)}>
			{socials.map((social, index) => (
				<Button
					key={index}
					iconId={social.icon}
					onClick={social.onClick}
					priority="tertiary"
					title={social.title}
				/>
			))}
		</div>
	);
}

const useStyles = tss.withName(ShareSocials.name).create(() => ({
	buttonContainer: {
		gap: fr.spacing("3v"),
		display: "flex",
	},
}));
