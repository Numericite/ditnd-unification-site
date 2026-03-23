import { fr } from "@codegouvfr/react-dsfr";
import { useState } from "react";
import { tss } from "tss-react/dsfr";

export default function LiteYouTube({ videoId }: { videoId: string }) {
	const [isLoaded, setIsLoaded] = useState(false);
	const { classes } = useStyles();

	if (!isLoaded) {
		return (
			<button
				type="button"
				onClick={() => setIsLoaded(true)}
				className={classes.liteButton}
			>
				<div
					className={classes.ytThumbnail}
					style={{
						backgroundImage: `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`,
					}}
				>
					<i className="fr-icon-play-fill" />
				</div>
			</button>
		);
	}

	return (
		<div className={classes.iframeWrapper}>
			<iframe
				title="YouTube video player"
				src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	);
}

const useStyles = tss.withName(LiteYouTube.name).create(() => ({
	liteButton: {
		all: "unset",
		display: "block",
		width: "100%",
		margin: `${fr.spacing("4v")} 0`,
		cursor: "pointer",
	},
	ytThumbnail: {
		width: "100%",
		aspectRatio: "16 / 9",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundSize: "cover",
		backgroundPosition: "center",
		color: "white",
		"& i:before": {
			"--icon-size": "clamp(24px, 10vw, 64px)",
		},
	},
	iframeWrapper: {
		width: "100%",
		aspectRatio: "16 / 9",

		"& iframe": {
			width: "100%",
			height: "100%",
			border: 0,
		},
	},
}));
