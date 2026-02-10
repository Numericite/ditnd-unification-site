import {
	FixedToolbarFeature,
	HeadingFeature,
	lexicalEditor,
	RelationshipFeature,
} from "@payloadcms/richtext-lexical";
import {
	convertLexicalToHTML,
	defaultHTMLConverters,
} from "@payloadcms/richtext-lexical/html";
import type { Field } from "payload";

export const standardFields = {
	title: {
		name: "title",
		label: "Titre",
		type: "text",
		required: true,
	},
	description: {
		name: "description",
		label: "Description",
		type: "textarea",
		required: true,
	},
	button: {
		label: "Lien associé",
		type: "collapsible",
		admin: {
			initCollapsed: true,
		},
		required: true,
		fields: [
			{
				name: "buttonText",
				label: "Texte du bouton",
				type: "text",
				required: true,
			},
			{
				name: "buttonLink",
				label: "Lien du bouton",
				type: "text",
				required: true,
			},
		],
	},
	wysiwyg: {
		name: "content",
		type: "richText",
		required: true,
		label: { fr: "Contenu" },
		editor: lexicalEditor({
			admin: {
				placeholder: "Commencez à écrire...",
				hideGutter: false,
			},

			features: ({ defaultFeatures }) => [
				...defaultFeatures.filter(
					(feature) =>
						feature.key !== "checklist" &&
						feature.key !== "inlineCode" &&
						feature.key !== "horizontalRule" &&
						feature.key !== "indent" &&
						feature.key !== "blockquote",
				),
				FixedToolbarFeature(),
				HeadingFeature({
					enabledHeadingSizes: ["h2", "h3", "h4", "h5", "h6"],
				}),
				RelationshipFeature({
					disabledCollections: [
						"users",
						"personas",
						"conditions",
						"journeys",
						"themes",
					],
				}),
			],
		}),
	},
	html: {
		name: "html",
		type: "text",
		required: true,
		label: { fr: "html" },
		admin: {
			readOnly: true,
			hidden: true,
		},
		hooks: {
			beforeChange: [
				async ({ siblingData, req: { payload } }) => {
					if (!siblingData?.content) return "";

					const uploadNodes = siblingData.content.root.children.filter(
						(child: any) => child.type === "upload",
					);

					const mediaMap: Record<string, any> = {};
					for (const node of uploadNodes) {
						const mediaId = node.value;
						if (mediaId && !mediaMap[mediaId]) {
							const media = await payload.findByID({
								collection: "medias",
								id: mediaId,
							});
							if (media) mediaMap[mediaId] = media;
						}
					}

					return convertLexicalToHTML({
						data: siblingData.content,
						converters: {
							...defaultHTMLConverters,
							upload: ({ node }) => {
								const media = mediaMap[node.value as number];
								if (!media) return "";
								return `<div style="display:flex; justify-content:${node.format};"><img src="${media.url}" alt="${media.alt || ""}" width="${media.width || ""}" height="${media.height || ""}" /></div>`;
							},
						},
					});
				},
			],
		},
	},
	image: {
		name: "image",
		label: "Image",
		type: "upload",
		relationTo: "medias",
		required: true,
	},
} satisfies Record<string, Field>;
