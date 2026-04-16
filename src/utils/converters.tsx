import type {
  DefaultNodeTypes,
  DefaultTypedEditorState,
  SerializedBlockNode,
} from "@payloadcms/richtext-lexical";
import {
  defaultJSXConverters,
  RichText,
  type JSXConverter,
  type JSXConverters,
} from "@payloadcms/richtext-lexical/react";
import {
  extractTextFromNodes,
  extractYouTubeId,
  ImageSizes,
  slugify,
} from "./tools";
import type { Media } from "~/payload/payload-types";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import CardDisplay from "~/components/ui/Cards/CardDisplay";
import { fr } from "@codegouvfr/react-dsfr";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import WysiwygAccordion from "~/components/ui/PracticalGuides/WysiwygAccordion";
import Image from "next/image";
import LiteYouTube from "~/components/ui/PracticalGuides/LiteYoutube";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Download } from "@codegouvfr/react-dsfr/Download";
import { Quote, type QuoteProps } from "@codegouvfr/react-dsfr/Quote";
import { Highlight } from "@codegouvfr/react-dsfr/Highlight";
import { CallOut, type CallOutProps } from "@codegouvfr/react-dsfr/CallOut";

interface CitationFields {
  quote?: string;
  author?: string;
  source?: string;
  sourceUrl?: string;
  image?: Media;
  size?: QuoteProps["size"];
}

interface HighlightFields {
  content?: DefaultTypedEditorState;
  size?: "sm" | "default" | "lg";
}

interface CalloutFields {
  title?: string;
  content?: DefaultTypedEditorState;
  iconId?: CallOutProps["iconId"];
  colorVariant?: CallOutProps["colorVariant"];
}

const imageStyle = { maxWidth: "100%", height: "auto" } as const;
const cardWrapperStyle = { maxWidth: "350px" } as const;

export const headingConverter: JSXConverters<DefaultNodeTypes>["heading"] = (
  args,
) => {
  const { node, nodesToJSX, converters } = args;

  if (node.tag === "h2") {
    const childrenJSX = nodesToJSX({
      nodes: node.children ?? [],
      converters,
    });

    const headingText = extractTextFromNodes(node.children ?? []);

    return <h2 id={slugify(headingText)}>{childrenJSX}</h2>;
  }

  const defaultHeadingConverter = defaultJSXConverters.heading;

  return typeof defaultHeadingConverter === "function"
    ? defaultHeadingConverter(args)
    : null;
};

export const uploadConverter: JSXConverters<DefaultNodeTypes>["upload"] = ({
  node,
}) => {
  const value = node.value as Media;

  if (!value?.url) return null;

  const isVideo =
    value.mimeType?.startsWith("video/") ||
    value.url.endsWith(".mov") ||
    value.url.endsWith(".mp4");

  if (isVideo)
    return (
      <div className={fr.cx("fr-responsive-vid")}>
        {/** biome-ignore lint/a11y/useMediaCaption: <no captions> */}
        <video controls preload="metadata" style={{ width: "100%" }}>
          <source src={value.url} type={value.mimeType || "video/mp4"} />
        </video>
      </div>
    );

  const isPdf =
    value.mimeType === "application/pdf" || value.url.endsWith(".pdf");

  if (isPdf)
    return (
      <Download
        className={fr.cx("fr-my-3v")}
        label={`Télécharger ${value.alt || value.filename || "le document"}`}
        details="PDF"
        linkProps={{ href: value.url, download: true }}
      />
    );

  if (value.width && value.height)
    return (
      <div
        className={fr.cx("fr-my-3v", "fr-col-12")}
        style={{ justifyContent: `${node.format}` }}
      >
        <Image
          style={imageStyle}
          fetchPriority="high"
          priority
          src={`${process.env.S3_BUCKET ?? ""}${value.url}`}
          alt={value.alt ?? ""}
          width={value.width}
          height={value.height}
        />
      </div>
    );

  return (
    <a target="_blank" rel="noopener noreferrer" href={value.url ?? ""} title={`${value.alt}, nouvelle fenêtre`}>
      {value.alt}
    </a>
  );
};

export const quoteConverter: JSXConverters<DefaultNodeTypes>["quote"] = (
  args,
) => {
  const { node, nodesToJSX, converters } = args;

  const childrenJSX = nodesToJSX({
    nodes: node.children ?? [],
    converters,
  });

  return (
    <blockquote
      className={fr.cx("fr-my-3v", "fr-col-12", "fr-highlight")}
      style={{ justifyContent: `${node.format}` }}
    >
      {childrenJSX}
    </blockquote>
  );
};

export const tableConverter: JSXConverter<any> = ({ node }) => {
  if (!node?.children) return null;

  const rows = node.children.map((row: any) => {
    return row.children.map((cell: any) => {
      const paragraphs = cell.children ?? [];

      const text = paragraphs
        .map((paragraph: any) =>
          (paragraph.children ?? [])
            .map((textNode: any) => textNode.text ?? "")
            .join(""),
        )
        .join("\n");

      return text;
    });
  });

  const headers = rows[0];
  const data = rows.slice(1);

  return <Table data={[...data]} headers={headers} />;
};

export const linkConverter: JSXConverters<DefaultNodeTypes>["link"] = (
  args,
) => {
  const { node, nodesToJSX, converters } = args;

  const url = node.fields.url;

  if (url?.includes("youtube.com") || url?.includes("youtu.be")) {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;

    return <LiteYouTube videoId={videoId} />;
  }

  if (node.fields.newTab) {
    const childrenJSX = nodesToJSX({
      nodes: node.children ?? [],
      converters,
    });
    const linkText = extractTextFromNodes(node.children ?? []);

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${linkText}, nouvelle fenêtre`}
      >
        {childrenJSX}
      </a>
    );
  }

  const defaultLinkConverter = defaultJSXConverters.link;

  return typeof defaultLinkConverter === "function"
    ? defaultLinkConverter(args)
    : null;
};

export const accordionConverter: JSXConverter<SerializedBlockNode> = ({
  node,
}) => {
  const items = node.fields?.items as
    | { title: string; content: any }[]
    | undefined;

  if (!items?.length) return null;

  return (
    <div className={fr.cx("fr-accordions-group", "fr-my-3v")}>
      {items.map((item, index) => (
        <WysiwygAccordion
          key={`${item.title}-${index}`}
          title={item.title}
          content={item.content}
        />
      ))}
    </div>
  );
};

export const citationConverter: JSXConverter<SerializedBlockNode> = ({
  node,
}) => {
  const value = node.fields as CitationFields | undefined;

  if (!value?.quote) return null;

  const source = value.source ? (
    <li>
      {value.sourceUrl ? (
        <a href={value.sourceUrl} target="_blank" rel="noopener noreferrer" title={`${value.source}, nouvelle fenêtre`}>
          {value.source}
        </a>
      ) : (
        value.source
      )}
    </li>
  ) : undefined;

  return (
    <Quote
      className={fr.cx("fr-my-3v")}
      text={value.quote}
      author={value.author}
      source={source}
      sourceUrl={value.sourceUrl}
      imageUrl={value.image?.url ? `${process.env.S3_BUCKET ?? ""}${value.image.url}` : undefined}
      size={value.size}
    />
  );
};

export const highlightConverter: JSXConverter<SerializedBlockNode> = ({
  node,
}) => {
  const value = node.fields as HighlightFields | undefined;

  if (!value?.content) return null;

  const size = value.size === "default" ? undefined : value.size;

  return (
    <Highlight className={fr.cx("fr-my-3v")} size={size}>
      <RichText data={value.content} converters={getConverters()} />
    </Highlight>
  );
};

export const calloutConverter: JSXConverter<SerializedBlockNode> = ({
  node,
}) => {
  const value = node.fields as CalloutFields | undefined;

  if (!value?.content) return null;

  return (
    <CallOut
      className={fr.cx("fr-my-3v")}
      title={value.title}
      iconId={value.iconId}
      colorVariant={value.colorVariant}
    >
      <RichText data={value.content} converters={getConverters()} />
    </CallOut>
  );
};

export const customImageSizeConverter: JSXConverter<SerializedBlockNode> = ({
  node,
}) => {
  const value = node.fields;

  if (!value?.image) return null;

  const image = value.image;
  const size = value.size;

  if (size === "full") {
    return (
      <div
        className={fr.cx("fr-my-3v", "fr-col-12")}
        style={{ justifyContent: `${node.format}` }}
      >
        <Image
          style={{ ...imageStyle, width: "100%" }}
          fetchPriority="high"
          priority
          src={`${process.env.S3_BUCKET ?? ""}${image.url}`}
          alt={`${image.alt || ""}`}
          width={image.width}
          height={image.height}
        />
      </div>
    );
  }

  if (size === "custom") {
    const customWidth = (value.customWidth as number) || image.width;
    const customHeight = (value.customHeight as number) || undefined;
    let height = customHeight;
    if (!height) {
      const ratio = image.height / image.width;
      height = Math.round(customWidth * ratio);
    }

    return (
      <div
        className={fr.cx("fr-my-3v", "fr-col-12")}
        style={{ justifyContent: `${node.format}` }}
      >
        <Image
          style={imageStyle}
          fetchPriority="high"
          priority
          src={`${process.env.S3_BUCKET ?? ""}${image.url}`}
          alt={`${image.alt || ""}`}
          width={customWidth}
          height={height}
        />
      </div>
    );
  }

  const currentSize = ImageSizes.find((imgSize) => imgSize.name === size);

  if (!currentSize) return null;

  const width = currentSize.width;
  let height = currentSize.height;

  if (width && !height) {
    const ratio = image.height / image.width;
    height = Math.round(width * ratio);
  }

  return (
    <div
      className={fr.cx("fr-my-3v", "fr-col-12")}
      style={{ justifyContent: `${node.format}` }}
    >
      <Image
        style={imageStyle}
        fetchPriority="high"
        priority
        src={`${process.env.S3_BUCKET ?? ""}${image.url}`}
        alt={`${image.alt || ""}`}
        width={width}
        height={height}
      />
    </div>
  );
};

export const youtubeConverter: JSXConverter<SerializedBlockNode> = ({
  node,
}) => {
  const url = node.fields?.url as string;
  if (!url) return null;

  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  const sizeUnit = (node.fields?.sizeUnit as string) || "percent";
  const sizeValue = (node.fields?.sizeValue as number) ?? 100;
  const width = sizeUnit === "percent" ? `${sizeValue}%` : `${sizeValue}px`;

  return (
    <div className={fr.cx("fr-my-3v")} style={{ width, maxWidth: "100%" }}>
      <LiteYouTube videoId={videoId} />
    </div>
  );
};

export const relationshipConverter: JSXConverters<DefaultNodeTypes>["relationship"] =
  ({ node }) => {
    if (node.relationTo === "practical-guides") {
      const value = node.value as AugmentedPracticalGuide;

      return (
        <div className={fr.cx("fr-mb-4v")} style={cardWrapperStyle}>
          <CardDisplay
            title={value.title}
            imageUrl={value.image?.url ?? undefined}
            imageAlt={value.image?.alt}
            conditions={value.conditions ?? []}
            themes={value.themes}
            redirect={`/fiches-pratiques/${value.slug}`}
            titleAs="h3"
          />
        </div>
      );
    }

    if (node.relationTo === "courses") {
      const value = node.value as AugmentedCourse;

      return (
        <div className={fr.cx("fr-mb-4v")} style={cardWrapperStyle}>
          <CardDisplay
            title={value.title}
            imageUrl={value.image?.url ?? undefined}
            imageAlt={value.image?.alt}
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
  };

export const getConverters = () => ({
  ...defaultJSXConverters,
  heading: headingConverter,
  relationship: relationshipConverter,
  upload: uploadConverter,
  quote: quoteConverter,
  blocks: {
    accordion: accordionConverter,
    image: customImageSizeConverter,
    youtube: youtubeConverter,
    citation: citationConverter,
    highlight: highlightConverter,
    callout: calloutConverter,
  },
  link: linkConverter,
  table: tableConverter,
});
