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
					▶
				</div>
			</button>
		);
	}

	return (
		<iframe
			className={classes.iframeWrapper}
			width="560px"
			height="315px"
			title="YouTube video player"
			src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
			allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
		/>
	);
}

const useStyles = tss.withName(LiteYouTube.name).create(() => ({
	liteButton: {
		all: "unset",
		display: "block",
		width: "100%",
		maxWidth: "560px",
		margin: "1rem 0",
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
		fontSize: "48px",
		color: "white",
	},
	iframeWrapper: {
		width: "100%",
		maxWidth: "560px",
		aspectRatio: "16 / 9",

		"& iframe": {
			width: "100%",
			height: "100%",
			border: 0,
		},
	},
}));
