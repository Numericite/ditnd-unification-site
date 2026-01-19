import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import type { Dispatch, SetStateAction } from "react";
import { tss } from "tss-react";

export default function InfoOrCoursesButtons({
	viewCourses,
	setViewCourses,
}: {
	viewCourses: boolean;
	setViewCourses: Dispatch<SetStateAction<boolean>>;
}) {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.centeredContainer)}>
			<Button
				onClick={() => setViewCourses(false)}
				priority={viewCourses ? "secondary" : "primary"}
			>
				Je m'informe
			</Button>
			<Button
				onClick={() => setViewCourses(true)}
				priority={viewCourses ? "primary" : "secondary"}
			>
				Je me forme
			</Button>
		</div>
	);
}

const useStyles = tss.withName(InfoOrCoursesButtons.name).create({
	centeredContainer: {
		textAlign: "center",
		paddingTop: fr.spacing("4w"),
	},
});
