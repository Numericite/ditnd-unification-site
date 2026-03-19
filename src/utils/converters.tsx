import type {
  DefaultNodeTypes,
  SerializedBlockNode,
} from "@payloadcms/richtext-lexical";
import {
  defaultJSXConverters,
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
import { tss } from "tss-react/dsfr";
import LiteYouTube from "~/components/ui/PracticalGuides/LiteYoutube";
import { Table } from "@codegouvfr/react-dsfr/Table";

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
  const { classes } = useStyles();

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
      <div className={fr.cx("fr-download", "fr-my-3v")}>
        <p>
          <a href={value.url} download className="fr-download__link">
            Télécharger {value.alt || value.filename || "le document"}
            <span className="fr-download__detail">PDF</span>
          </a>
        </p>
      </div>
    );

  if (value.width && value.height)
    return (
      <div
        className={fr.cx("fr-my-3v", "fr-col-12")}
        style={{ justifyContent: `${node.format}` }}
      >
        <Image
          className={classes.image}
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
    <a target="_blank" rel="noopener noreferrer" href={value.url ?? ""}>
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
  const { node } = args;

  const url = node.fields.url;

  if (url?.includes("youtube.com") || url?.includes("youtu.be")) {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;

    return <LiteYouTube videoId={videoId} />;
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

export const customImageSizeConverter: JSXConverter<SerializedBlockNode> = ({
  node,
}) => {
  const { classes, cx } = useStyles();

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
          className={cx(classes.image)}
          fetchPriority="high"
          priority
          src={`${process.env.S3_BUCKET ?? ""}${image.url}`}
          alt={`${image.alt || ""}`}
          width={image.width}
          height={image.height}
          style={{ width: "100%", height: "auto" }}
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
          className={cx(classes.image)}
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

  const currentSize = ImageSizes.filter((imgSize) => imgSize.name === size)[0];

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
      style={{
        justifyContent: `${node.format}`,
      }}
    >
      <Image
        className={cx(classes.image)}
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
    const { classes, cx } = useStyles();

    if (node.relationTo === "practical-guides") {
      const value = node.value as AugmentedPracticalGuide;

      return (
        <div className={cx(fr.cx("fr-mb-4v"), classes.cardWrapper)}>
          <CardDisplay
            title={value.title}
            imageUrl={value.image?.url ?? undefined}
            imageAlt={value.image?.alt}
            conditions={value.conditions ?? []}
            themes={value.themes}
            redirect={`/guides/${value.slug}`}
            titleAs="h3"
          />
        </div>
      );
    }

    if (node.relationTo === "courses") {
      const value = node.value as AugmentedCourse;

      return (
        <div className={cx(fr.cx("fr-mb-4v"), classes.cardWrapper)}>
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

const useStyles = tss.create(() => ({
  image: {
    maxWidth: "100%",
    height: "auto",
  },
  cardWrapper: {
    maxWidth: "350px",
  },
  videoWrapper: {
    maxWidth: "100%",
    maxHeight: "100%",
    cursor: "auto!important",

    video: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      pointerEvents: "auto",
      cursor: "pointer!important",
    },
  },
}));
