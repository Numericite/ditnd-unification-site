import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";
import { slugify } from "~/utils/tools";
import CardDisplay from "../Cards/CardDisplay";
import {
	defaultJSXConverters,
	RichText,
} from "@payloadcms/richtext-lexical/react";
import type {
	DefaultTypedEditorState,
	SerializedHeadingNode,
	SerializedRelationshipNode,
	SerializedUploadNode,
} from "@payloadcms/richtext-lexical";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import type { Media } from "~/payload/payload-types";

export default function WysiwygContent({
	title,
	content,
}: {
	title: string;
	content: DefaultTypedEditorState;
}) {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.wysiwig)} id="wysiwig-content">
			<h1>{title}</h1>
			<RichText
				data={content}
				converters={{
					...defaultJSXConverters,
					heading: (args) => {
						const { node } = args;

						const headingNode = node as SerializedHeadingNode;

						if (headingNode.tag === "h2") {
							const childrenJSX = args.nodesToJSX({
								nodes: headingNode.children ?? [],
								converters: args.converters,
							});

							const headingText = (headingNode.children ?? [])
								.map((child: any) => child.text ?? "")
								.join(" ");

							return <h2 id={slugify(headingText)}>{childrenJSX}</h2>;
						}
						const defaultHeading = defaultJSXConverters.heading;

						return typeof defaultHeading === "function"
							? defaultHeading(args)
							: null;
					},
					relationship: ({ node }) => {
						const relationshipNode = node as SerializedRelationshipNode;

						if (relationshipNode.relationTo === "practical-guides") {
							const value = relationshipNode.value as AugmentedPracticalGuide;

							return (
								<div className={fr.cx("fr-col-12", "fr-col-md-6")}>
									<CardDisplay
										title={value.title}
										conditions={value.conditions ?? []}
										themes={value.themes}
										redirect={`/guides/${value.slug}`}
										titleAs="h3"
										noImg
									/>
								</div>
							);
						}

						if (relationshipNode.relationTo === "courses") {
							const value = relationshipNode.value as AugmentedCourse;

							return (
								<div className={fr.cx("fr-col-sm-12", "fr-col-md-6")}>
									<CardDisplay
										title={value.title}
										conditions={[value.condition]}
										themes={[value.theme]}
										redirect={value.link}
										titleAs="h3"
										noImg
										kind="courses"
									/>
								</div>
							);
						}

						return null;
					},
					upload: ({ node }) => {
						const uploadNode = node as SerializedUploadNode;

						const value = uploadNode.value as Media;

						if (!value?.url) return null;
						return (
							<div
								style={{ display: "flex", justifyContent: `${node.format}` }}
							>
								<img
									fetchPriority="high"
									src={`${value.url}`}
									alt={`${value.alt || ""}`}
									width={`${value.width || ""}`}
									height={`${value.height || ""}`}
								/>
							</div>
						);
					},
				}}
			/>
		</div>
	);
}

const useStyles = tss.withName(WysiwygContent.name).create(() => ({
	wysiwig: {
		h1: {
			color: fr.colors.decisions.text.active.blueFrance.default,
		},
		h2: {
			fontSize: "1.75rem",
			lineHeight: "2.25rem",
		},
		h3: {
			fontSize: "1.5rem",
			lineHeight: "2rem",
		},
		h4: {
			fontSize: "1.25rem",
			lineHeight: "1.75rem",
		},
		h5: {
			fontSize: "1rem",
			lineHeight: "1.5rem",
		},
		h6: {
			fontSize: "1rem",
			lineHeight: "1.5rem",
		},
		ul: {
			paddingInlineStart: "2.5rem",
			"li:has(ul)": {
				listStyle: "none",
			},
			ul: {
				li: {
					listStyleType: "circle",
				},
			},
		},
		a: {
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
		},
	},
}));
