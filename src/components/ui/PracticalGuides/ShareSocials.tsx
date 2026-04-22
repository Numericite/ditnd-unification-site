import { fr, type FrIconClassName } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { tss } from "tss-react/dsfr";

type SocialProps = {
	icon: FrIconClassName;
	onClick: () => void;
	title: string;
};

function openSharePopup(url: string) {
	const width = 600;
	const height = 500;
	const left = (window.innerWidth - width) / 2 + window.screenX;
	const top = (window.innerHeight - height) / 2 + window.screenY;
	window.open(
		url,
		"share",
		`popup=1,width=${width},height=${height},left=${left},top=${top}`,
	);
}

function getShareContext() {
	const url = window.location.href.replace(/#.*$/, "");
	const title = document.title;
	return { url, title };
}

const socials: SocialProps[] = [
	{
		icon: "fr-icon-facebook-circle-line",
		onClick: () => {
			const { url } = getShareContext();
			openSharePopup(
				`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			);
		},
		title: "Partager sur Facebook",
	},
	{
		icon: "fr-icon-twitter-x-line",
		onClick: () => {
			const { url, title } = getShareContext();
			openSharePopup(
				`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
			);
		},
		title: "Partager sur X",
	},
	{
		icon: "fr-icon-linkedin-box-line",
		onClick: () => {
			const { url } = getShareContext();
			openSharePopup(
				`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
			);
		},
		title: "Partager sur LinkedIn",
	},
	{
		icon: "fr-icon-mail-line",
		onClick: () => {
			const { url, title } = getShareContext();
			const subject = title;
			const body = `Je vous partage cet article : ${title}\n\n${url}`;
			window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		},
		title: "Partager par e-mail",
	},
	{
		icon: "fr-icon-links-line",
		onClick: () => {
			const { url } = getShareContext();
			navigator.clipboard.writeText(url);
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
