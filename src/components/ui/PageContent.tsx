import type { ReactNode } from "react";
import { tss } from "tss-react/dsfr";

type Props = {
	children: ReactNode;
	className?: string;
};

export default function PageContent({ children, className }: Props) {
	const { classes, cx } = useStyles();
	return (
		<div id="contenu" tabIndex={-1} className={cx(classes.root, className)}>
			{children}
		</div>
	);
}

const useStyles = tss.withName(PageContent.name).create({
	root: {
		"&:focus": {
			outline: "none",
		},
	},
});
