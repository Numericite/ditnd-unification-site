import type {
	DefaultNodeTypes,
	SerializedHeadingNode,
	SerializedRelationshipNode,
	SerializedUploadNode,
} from "@payloadcms/richtext-lexical";
import {
	defaultJSXConverters,
	type JSXConverters,
} from "@payloadcms/richtext-lexical/react";
import { extractTextFromNodes, slugify } from "./tools";
import type { Media } from "~/payload/payload-types";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import CardDisplay from "~/components/ui/Cards/CardDisplay";
import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";

export const headingConverter: JSXConverters<DefaultNodeTypes>["heading"] = (
	args,
) => {
	const { node, nodesToJSX, converters } = args;

	const headingNode = node as SerializedHeadingNode;

	if (headingNode.tag === "h2") {
		const childrenJSX = nodesToJSX({
			nodes: headingNode.children ?? [],
			converters,
		});

		const headingText = extractTextFromNodes(headingNode.children ?? []);

		return <h2 id={slugify(headingText)}>{childrenJSX}</h2>;
	}

	const defaultHeading = defaultJSXConverters.heading;

	return typeof defaultHeading === "function" ? defaultHeading(args) : null;
};

export const uploadConverter: JSXConverters<DefaultNodeTypes>["upload"] = ({
	node,
}) => {
	const uploadNode = node as SerializedUploadNode;

	const value = uploadNode.value as Media;

	if (!value?.url) return null;
	return (
		<div
			className={fr.cx("fr-my-3v")}
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
};

export const relationshipConverter: JSXConverters<DefaultNodeTypes>["relationship"] =
	({ node }) => {
		{
			const relationshipNode = node as SerializedRelationshipNode;

			if (relationshipNode.relationTo === "practical-guides") {
				const value = relationshipNode.value as AugmentedPracticalGuide;

				return (
					<div className={fr.cx("fr-col-12", "fr-col-md-6", "fr-my-3v")}>
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
		}
	};
