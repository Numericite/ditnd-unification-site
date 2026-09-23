import { fr } from "@codegouvfr/react-dsfr";
import Link from "next/link";
import { tss } from "tss-react/dsfr";

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Props = {
	availableLetters: Set<string>;
	activeLetter: string | null;
	buildHref: (letter: string | null) => string;
	onSelect: (letter: string | null) => void;
};

export default function AlphabetNav({
	availableLetters,
	activeLetter,
	buildHref,
	onSelect,
}: Props) {
	const { classes, cx } = useStyles();

	const handleClick =
		(letter: string | null) => (event: React.MouseEvent<HTMLAnchorElement>) => {
			if (
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.button !== 0
			)
				return;
			event.preventDefault();
			onSelect(letter);
		};

	return (
		<nav aria-label="Navigation par première lettre" className={classes.root}>
			<ul className={classes.list}>
				<li>
					<Link
						href={buildHref(null)}
						prefetch={false}
						onClick={handleClick(null)}
						aria-current={activeLetter === null ? "true" : undefined}
						className={cx(
							classes.item,
							classes.all,
							activeLetter === null ? classes.active : classes.inactive,
						)}
					>
						Tous
					</Link>
				</li>
				{ALPHABET.map((letter) => {
					const isAvailable = availableLetters.has(letter);

					if (!isAvailable) {
						return (
							<li key={letter}>
								<span
									className={cx(classes.item, classes.disabled)}
									aria-disabled="true"
								>
									<span className={fr.cx("fr-sr-only")}>
										Aucun terme commençant par{" "}
									</span>
									{letter}
								</span>
							</li>
						);
					}

					const isActive = activeLetter === letter;

					return (
						<li key={letter}>
							<Link
								href={buildHref(letter)}
								prefetch={false}
								onClick={handleClick(letter)}
								aria-current={isActive ? "true" : undefined}
								className={cx(
									classes.item,
									isActive ? classes.active : classes.inactive,
								)}
							>
								<span className={fr.cx("fr-sr-only")}>
									Termes commençant par{" "}
								</span>
								{letter}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

const useStyles = tss.withName(AlphabetNav.name).create({
	root: {
		marginBottom: fr.spacing("4w"),
	},
	list: {
		listStyle: "none",
		padding: 0,
		margin: 0,
		display: "flex",
		flexWrap: "wrap",
		gap: fr.spacing("1v"),
	},
	item: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		minWidth: "2.5rem",
		height: "2.5rem",
		padding: `0 ${fr.spacing("1w")}`,
		fontWeight: 500,
		backgroundImage: "none",
		border: "1px solid transparent",
	},
	all: {
		minWidth: "auto",
	},
	inactive: {
		"--hover-tint": fr.colors.decisions.background.alt.blueFrance.hover,
		"--active-tint": fr.colors.decisions.background.alt.blueFrance.active,
		borderColor: fr.colors.decisions.border.default.grey.default,
		backgroundColor: "transparent",
		color: fr.colors.decisions.text.actionHigh.blueFrance.default,
	},
	active: {
		"--hover-tint": fr.colors.decisions.background.actionHigh.blueFrance.hover,
		"--active-tint":
			fr.colors.decisions.background.actionHigh.blueFrance.active,
		backgroundColor:
			fr.colors.decisions.background.actionHigh.blueFrance.default,
		borderColor: fr.colors.decisions.background.actionHigh.blueFrance.default,
		color: fr.colors.decisions.text.inverted.grey.default,
		"&:hover, &:active": {
			borderColor: "transparent",
			color: fr.colors.decisions.text.inverted.grey.default,
		},
	},
	disabled: {
		borderColor: fr.colors.decisions.border.default.grey.default,
		color: fr.colors.decisions.text.disabled.grey.default,
		backgroundColor: fr.colors.decisions.background.disabled.grey.default,
		cursor: "not-allowed",
	},
});
