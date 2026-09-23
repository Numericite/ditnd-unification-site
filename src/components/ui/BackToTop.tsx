import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { type MouseEvent, useEffect, useState } from "react";
import { tss } from "tss-react/dsfr";

export default function BackToTop() {
	const { classes, cx } = useStyles();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		let frame: number | null = null;

		const update = () => {
			frame = null;
			setIsVisible(window.scrollY > window.innerHeight);
		};

		const handleScroll = () => {
			if (frame !== null) return;
			frame = window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleScroll, { passive: true });

		return () => {
			if (frame !== null) window.cancelAnimationFrame(frame);
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, []);

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		const target = document.getElementById("top");
		if (!target) return;

		event.preventDefault();
		target.scrollIntoView({
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
				? "auto"
				: "smooth",
		});
		target.focus({ preventScroll: true });
	};

	if (!isVisible) return null;

	return (
		<Button
			className={cx(classes.button)}
			priority="secondary"
			iconId="fr-icon-arrow-up-fill"
			title="Haut de page"
			linkProps={{ href: "#top", onClick: handleClick }}
		>
			Haut de page
		</Button>
	);
}

const useStyles = tss.withName(BackToTop.name).create({
	button: {
		zIndex: 1100,
		alignSelf: "flex-end",
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		[fr.breakpoints.down("md")]: {
			display: "none",
		},
	},
});
