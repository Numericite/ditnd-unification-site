// Client-side exporters for the simplified content generator.
//
// The generated markdown is restricted to the FALC whitelist (##/### headings,
// paragraphs, - and 1. lists, **bold**, [text](url) links), so a small
// dedicated parser is enough to feed the DOCX and PDF builders.

export type Inline = {
	text: string;
	bold: boolean;
	link?: string;
};

export type Block =
	| { type: "heading"; level: 2 | 3; inlines: Inline[] }
	| { type: "paragraph"; inlines: Inline[] }
	| { type: "list"; ordered: boolean; items: Inline[][] };

const LINK_REGEX = /\[([^\]]*)\]\(([^)\s]+)\)/g;
const BOLD_REGEX = /\*\*([^*]+)\*\*|__([^_]+)__/g;

function parseBoldSegments(text: string): Inline[] {
	const inlines: Inline[] = [];
	let lastIndex = 0;
	BOLD_REGEX.lastIndex = 0;
	let match = BOLD_REGEX.exec(text);
	while (match) {
		if (match.index > lastIndex) {
			inlines.push({ text: text.slice(lastIndex, match.index), bold: false });
		}
		inlines.push({ text: match[1] ?? match[2] ?? "", bold: true });
		lastIndex = match.index + match[0].length;
		match = BOLD_REGEX.exec(text);
	}
	if (lastIndex < text.length) {
		inlines.push({ text: text.slice(lastIndex), bold: false });
	}
	return inlines.filter((inline) => inline.text.length > 0);
}

function parseInlines(text: string): Inline[] {
	const inlines: Inline[] = [];
	let lastIndex = 0;
	LINK_REGEX.lastIndex = 0;
	let match = LINK_REGEX.exec(text);
	while (match) {
		if (match.index > lastIndex) {
			inlines.push(...parseBoldSegments(text.slice(lastIndex, match.index)));
		}
		const label = (match[1] ?? "").replace(/\*\*|__/g, "").trim();
		const url = match[2];
		if (label && url) {
			inlines.push({ text: label, bold: false, link: url });
		}
		lastIndex = match.index + match[0].length;
		match = LINK_REGEX.exec(text);
	}
	if (lastIndex < text.length) {
		inlines.push(...parseBoldSegments(text.slice(lastIndex)));
	}
	return inlines;
}

export function parseSimplifiedMarkdown(markdown: string): Block[] {
	const blocks: Block[] = [];
	let paragraphLines: string[] = [];
	let list: { ordered: boolean; items: Inline[][] } | null = null;

	const flushParagraph = () => {
		if (paragraphLines.length === 0) return;
		blocks.push({
			type: "paragraph",
			inlines: parseInlines(paragraphLines.join(" ")),
		});
		paragraphLines = [];
	};
	const flushList = () => {
		if (!list) return;
		blocks.push({ type: "list", ordered: list.ordered, items: list.items });
		list = null;
	};

	for (const rawLine of markdown.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line) {
			flushParagraph();
			flushList();
			continue;
		}

		const heading = /^(#{1,6})\s+(.*)$/.exec(line);
		if (heading) {
			flushParagraph();
			flushList();
			blocks.push({
				type: "heading",
				level: (heading[1] ?? "").length <= 2 ? 2 : 3,
				inlines: parseInlines(heading[2] ?? ""),
			});
			continue;
		}

		const bulletItem = /^[-*]\s+(.*)$/.exec(line);
		if (bulletItem) {
			flushParagraph();
			if (list?.ordered) flushList();
			list ??= { ordered: false, items: [] };
			list.items.push(parseInlines(bulletItem[1] ?? ""));
			continue;
		}

		const orderedItem = /^\d+[.)]\s+(.*)$/.exec(line);
		if (orderedItem) {
			flushParagraph();
			if (list && !list.ordered) flushList();
			list ??= { ordered: true, items: [] };
			list.items.push(parseInlines(orderedItem[1] ?? ""));
			continue;
		}

		flushList();
		paragraphLines.push(line);
	}

	flushParagraph();
	flushList();
	return blocks;
}

export function buildFilename(title: string, extension: string): string {
	const slug = title
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);
	return `${slug || "contenu-simplifie"}.${extension}`;
}

function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
}

export function exportAsMarkdown(title: string, markdown: string): void {
	const content = title.trim()
		? `# ${title.trim()}\n\n${markdown.trim()}\n`
		: `${markdown.trim()}\n`;
	downloadBlob(
		new Blob([content], { type: "text/markdown;charset=utf-8" }),
		buildFilename(title, "md"),
	);
}

export async function exportAsDocx(
	title: string,
	markdown: string,
): Promise<void> {
	const {
		AlignmentType,
		Document,
		ExternalHyperlink,
		HeadingLevel,
		LevelFormat,
		Packer,
		Paragraph,
		TextRun,
	} = await import("docx");

	const blocks = parseSimplifiedMarkdown(markdown);

	const inlinesToChildren = (inlines: Inline[]) =>
		inlines.map((inline) =>
			inline.link
				? new ExternalHyperlink({
						children: [
							new TextRun({
								text: inline.text,
								bold: inline.bold,
								style: "Hyperlink",
							}),
						],
						link: inline.link,
					})
				: new TextRun({ text: inline.text, bold: inline.bold }),
		);

	const children: InstanceType<typeof Paragraph>[] = [];
	if (title.trim()) {
		children.push(
			new Paragraph({
				heading: HeadingLevel.TITLE,
				children: [new TextRun({ text: title.trim() })],
			}),
		);
	}

	// One numbering reference per ordered list so each restarts at 1.
	let orderedListCount = 0;
	const numberingConfigs: {
		reference: string;
		levels: {
			level: number;
			format: (typeof LevelFormat)[keyof typeof LevelFormat];
			text: string;
			alignment: (typeof AlignmentType)[keyof typeof AlignmentType];
		}[];
	}[] = [];

	for (const block of blocks) {
		if (block.type === "heading") {
			children.push(
				new Paragraph({
					heading:
						block.level === 2 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
					children: inlinesToChildren(block.inlines),
				}),
			);
			continue;
		}
		if (block.type === "paragraph") {
			children.push(
				new Paragraph({
					children: inlinesToChildren(block.inlines),
					spacing: { after: 160 },
				}),
			);
			continue;
		}

		if (block.ordered) {
			const reference = `ordered-list-${orderedListCount++}`;
			numberingConfigs.push({
				reference,
				levels: [
					{
						level: 0,
						format: LevelFormat.DECIMAL,
						text: "%1.",
						alignment: AlignmentType.START,
					},
				],
			});
			for (const item of block.items) {
				children.push(
					new Paragraph({
						children: inlinesToChildren(item),
						numbering: { reference, level: 0 },
						spacing: { after: 80 },
					}),
				);
			}
		} else {
			for (const item of block.items) {
				children.push(
					new Paragraph({
						children: inlinesToChildren(item),
						bullet: { level: 0 },
						spacing: { after: 80 },
					}),
				);
			}
		}
	}

	const doc = new Document({
		numbering: { config: numberingConfigs },
		sections: [{ children }],
	});

	downloadBlob(await Packer.toBlob(doc), buildFilename(title, "docx"));
}

export async function exportAsPdf(
	title: string,
	markdown: string,
): Promise<void> {
	const pdfMake = await import("pdfmake/build/pdfmake");
	const vfsModule = await import("pdfmake/build/vfs_fonts");
	pdfMake.addVirtualFileSystem(vfsModule.default);

	const blocks = parseSimplifiedMarkdown(markdown);

	const inlinesToPdf = (inlines: Inline[]) =>
		inlines.map((inline) => ({
			text: inline.text,
			bold: inline.bold,
			...(inline.link
				? {
						link: inline.link,
						color: "#000091",
						decoration: "underline" as const,
					}
				: {}),
		}));

	const content: import("pdfmake/interfaces").Content = [];
	if (title.trim()) {
		content.push({ text: title.trim(), style: "title" });
	}
	for (const block of blocks) {
		if (block.type === "heading") {
			content.push({
				text: inlinesToPdf(block.inlines),
				style: block.level === 2 ? "h2" : "h3",
			});
		} else if (block.type === "paragraph") {
			content.push({
				text: inlinesToPdf(block.inlines),
				margin: [0, 0, 0, 8],
			});
		} else {
			const items = block.items.map((item) => ({
				text: inlinesToPdf(item),
				margin: [0, 0, 0, 3] as [number, number, number, number],
			}));
			content.push(
				block.ordered
					? { ol: items, margin: [0, 0, 0, 8] }
					: { ul: items, margin: [0, 0, 0, 8] },
			);
		}
	}

	pdfMake
		.createPdf({
			info: { title: title.trim() || "Contenu simplifié" },
			pageMargins: [56, 56, 56, 56],
			content,
			styles: {
				title: { fontSize: 20, bold: true, margin: [0, 0, 0, 16] },
				h2: { fontSize: 15, bold: true, margin: [0, 12, 0, 6] },
				h3: { fontSize: 12.5, bold: true, margin: [0, 10, 0, 4] },
			},
			defaultStyle: { fontSize: 11, lineHeight: 1.35 },
		})
		.download(buildFilename(title, "pdf"));
}
