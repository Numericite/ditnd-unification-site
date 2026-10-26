import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Tag from "@codegouvfr/react-dsfr/Tag";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import Image from "next/image";
import { tss } from "tss-react/dsfr";
import ShareSocials from "~/components/ui/CmsPage/ShareSocials";
import WysiwygContent from "~/components/ui/CmsPage/WysiwygContent";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import { courseDurationLabel, courseFormatLabel } from "~/utils/courses";

type Props = {
	course: AugmentedCourse;
};

export default function CourseDisplay({ course }: Props) {
	const { classes, cx } = useStyles();

	const banner = course.imageBanner?.url ? (
		<Image
			className={cx(fr.cx("fr-responsive-img"), classes.imageBanner)}
			fetchPriority="high"
			priority
			alt=""
			role="presentation"
			src={course.imageBanner.url}
			width={1200}
			height={240}
		/>
	) : null;

	const publishedAt = course.publishedAt ?? course.createdAt;
	const format = courseFormatLabel(course.format);
	const duration = courseDurationLabel(course.duration);

	const dateLine = (
		<p className={fr.cx("fr-text--sm")}>
			{`Publié le ${new Date(publishedAt).toLocaleDateString("fr-FR")}`}
			{course.lastUpdatedAt &&
				` - Mis à jour le ${new Date(course.lastUpdatedAt).toLocaleDateString("fr-FR")}`}
		</p>
	);

	const sidebar = (
		<div className={cx(classes.sidebarSticky)}>
			<Button
				iconId="fr-icon-external-link-line"
				iconPosition="right"
				className={cx(classes.fullWidth, fr.cx("fr-mb-3w"))}
				linkProps={{
					href: course.link,
					target: "_blank",
					rel: "noopener noreferrer",
					title: `Accéder à ${course.title}, nouvelle fenêtre`,
					"aria-label": `Accéder à la formation ${course.title}, nouvelle fenêtre`,
				}}
			>
				Accéder à la formation
			</Button>

			{(format || duration) && (
				<ul className={fr.cx("fr-badges-group", "fr-mb-2w")}>
					{format && (
						<li>
							<Badge noIcon severity="info">
								{format}
							</Badge>
						</li>
					)}
					{duration && (
						<li>
							<Badge noIcon>{duration}</Badge>
						</li>
					)}
				</ul>
			)}

			<ul className={cx(fr.cx("fr-tags-group"), classes.tagsList)}>
				{course.conditions.map((condition) => (
					<li key={condition.id}>
						<Tag
							style={{
								color: condition.textColor,
								backgroundColor: condition.backgroundColor,
							}}
						>
							<strong>{condition.slug.toUpperCase()}</strong>
						</Tag>
					</li>
				))}
				{course.themes.map((theme) => (
					<li key={theme.id}>
						<Tag>
							<strong>{theme.name}</strong>
						</Tag>
					</li>
				))}
			</ul>
		</div>
	);

	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			{banner && <div className={fr.cx("fr-col-12")}>{banner}</div>}

			<div className={fr.cx("fr-col-12")}>
				<h1 className={cx(classes.title)}>{course.title}</h1>
				{dateLine}
			</div>

			<div
				className={fr.cx(
					"fr-col-12",
					"fr-col-lg-3",
					"fr-col-md-12",
					"fr-col-sm-12",
					"fr-mb-2w",
				)}
			>
				{sidebar}
			</div>

			<div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
				<p
					className={cx(
						fr.cx("fr-text--lead", "fr-mb-3w"),
						classes.description,
					)}
				>
					{course.description}
				</p>

				{course.content && (
					<WysiwygContent content={course.content as DefaultTypedEditorState} />
				)}

				<div className={cx(classes.footerContent)}>
					<div className={cx(classes.footerInner)}>
						<p className={fr.cx("fr-text--md")}>Partager la page</p>
						<ShareSocials />
					</div>
				</div>
			</div>
		</div>
	);
}

const useStyles = tss.withName({ CourseDisplay }).create(() => ({
	title: {
		color: fr.colors.decisions.text.active.blueFrance.default,
	},
	imageBanner: {
		width: "100%",
		height: "240px",
		objectFit: "cover",
	},
	sidebarSticky: {
		position: "sticky",
		top: "var(--sticky-top)",
	},
	fullWidth: {
		width: "100%",
		justifyContent: "center",
	},
	tagsList: {
		paddingInlineStart: "0rem!important",
	},
	description: {
		color: fr.colors.decisions.text.default.grey.default,
	},
	footerContent: {
		borderTop: "2px solid var(--border-default-grey)",
		marginBottom: fr.spacing("3w"),
	},
	footerInner: {
		marginTop: fr.spacing("2w"),
	},
}));
