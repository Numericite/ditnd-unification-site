import { fr, type FrIconClassName } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Button from "@codegouvfr/react-dsfr/Button";
import Tag from "@codegouvfr/react-dsfr/Tag";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import Image from "next/image";
import { tss } from "tss-react/dsfr";
import WysiwygContent from "~/components/ui/CmsPage/WysiwygContent";
import PageContent from "~/components/ui/PageContent";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import { courseDurationLabel, courseFormatLabel } from "~/utils/courses";

type Props = {
	course: AugmentedCourse;
};

type PracticalInfo = {
	label: string;
	iconId: FrIconClassName;
	values: (string | undefined)[];
};

export default function CourseDisplay({ course }: Props) {
	const { classes, cx } = useStyles();

	const publishedAt = course.publishedAt ?? course.createdAt;
	const format = courseFormatLabel(course.format);
	const duration = courseDurationLabel(course.duration);

	const practicalInfos = (
		[
			{ label: "Format", iconId: "fr-icon-map-pin-2-line", values: [format] },
			{ label: "Durée", iconId: "fr-icon-time-line", values: [duration] },
			{
				label: course.conditions.length > 1 ? "Troubles" : "Trouble",
				iconId: "fr-icon-health-book-line",
				values: course.conditions.map(
					(condition) => `${condition.name} (${condition.acronym})`,
				),
			},
		] satisfies PracticalInfo[]
	)
		.map((info) => ({
			...info,
			values: info.values.filter((value): value is string => !!value),
		}))
		.filter((info) => info.values.length > 0);

	const sidebarSections = [
		practicalInfos.length > 0 && (
			<section key="infos" className={classes.sidebarSection}>
				<h2 className={cx(fr.cx("fr-h6"), classes.sidebarTitle)}>
					Informations pratiques
				</h2>
				<dl className={classes.infosList}>
					{practicalInfos.map((info) => (
						<div key={info.label} className={classes.infoItem}>
							<span
								className={cx(fr.cx(info.iconId), classes.infoIcon)}
								aria-hidden="true"
							/>
							<div>
								<dt className={classes.infoLabel}>{info.label}</dt>
								{info.values.map((value) => (
									<dd key={value} className={classes.infoValue}>
										{value}
									</dd>
								))}
							</div>
						</div>
					))}
				</dl>
			</section>
		),
		course.themes.length > 0 && (
			<section key="themes" className={classes.sidebarSection}>
				<h2 className={cx(fr.cx("fr-h6"), classes.sidebarTitle)}>
					Thématiques
				</h2>
				<ul className={cx(fr.cx("fr-tags-group"), classes.tagsList)}>
					{course.themes.map((theme) => (
						<li key={theme.id}>
							<Tag small>{theme.name}</Tag>
						</li>
					))}
				</ul>
			</section>
		),
	].filter(Boolean);

	return (
		<>
			<div className={classes.header}>
				<div className={fr.cx("fr-container")}>
					<Breadcrumb
						className={classes.breadcrumb}
						currentPageLabel={course.title}
						homeLinkProps={{ href: "/" }}
						segments={[
							{
								label: "Formations",
								linkProps: { href: "/formations" },
							},
						]}
					/>
					<PageContent>
						<h1 className={classes.title}>{course.title}</h1>
						<p className={cx(fr.cx("fr-text--sm"), classes.dateLine)}>
							{`Publié le ${new Date(publishedAt).toLocaleDateString("fr-FR")}`}
							{course.lastUpdatedAt &&
								` - Mis à jour le ${new Date(course.lastUpdatedAt).toLocaleDateString("fr-FR")}`}
						</p>
						<Button
							size="large"
							iconId="fr-icon-external-link-line"
							iconPosition="right"
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
					</PageContent>
				</div>
			</div>

			{course.imageBanner?.url && (
				<div className={classes.bannerBand}>
					<div className={fr.cx("fr-container")}>
						<Image
							className={cx(fr.cx("fr-responsive-img"), classes.banner)}
							fetchPriority="high"
							priority
							alt=""
							role="presentation"
							src={course.imageBanner.url}
							width={1200}
							height={240}
						/>
					</div>
				</div>
			)}

			<div className={cx(fr.cx("fr-container"), classes.body)}>
				{sidebarSections.length > 0 && (
					<aside className={classes.sidebar}>{sidebarSections}</aside>
				)}

				<div className={classes.content}>
					{course.description && (
						<p className={cx(fr.cx("fr-text--lg"), classes.description)}>
							{course.description}
						</p>
					)}
					{course.content && (
						<>
							<h2 className={cx(fr.cx("fr-h4"), classes.contentTitle)}>
								Description de la formation
							</h2>
							<WysiwygContent
								content={course.content as DefaultTypedEditorState}
							/>
						</>
					)}
				</div>
			</div>
		</>
	);
}

const useStyles = tss.withName({ CourseDisplay }).create(() => ({
	header: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		paddingTop: fr.spacing("2w"),
		paddingBottom: fr.spacing("6w"),
	},
	bannerBand: {
		background: `linear-gradient(to bottom, ${fr.colors.decisions.background.alt.blueFrance.default} 50%, transparent 50%)`,
	},
	banner: {
		display: "block",
		width: "100%",
		height: "240px",
		objectFit: "cover",
		[fr.breakpoints.down("md")]: {
			height: "auto",
			aspectRatio: "10 / 3",
		},
	},
	breadcrumb: {
		margin: `0 0 ${fr.spacing("2w")}`,
	},
	title: {
		color: fr.colors.decisions.text.active.blueFrance.default,
		marginBottom: fr.spacing("2w"),
	},
	dateLine: {
		color: fr.colors.decisions.text.default.grey.default,
		marginBottom: fr.spacing("3w"),
	},
	body: {
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		rowGap: fr.spacing("6w"),
		paddingTop: fr.spacing("6w"),
		paddingBottom: fr.spacing("10w"),
		[fr.breakpoints.up("lg")]: {
			gridTemplateColumns: "22rem minmax(0, 1fr)",
			columnGap: fr.spacing("8w"),
		},
	},
	sidebar: {
		display: "flex",
		flexDirection: "column",
		"& > section + section": {
			borderTop: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
			paddingTop: fr.spacing("3w"),
			marginTop: fr.spacing("3w"),
		},
	},
	sidebarSection: {
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("2w"),
	},
	sidebarTitle: {
		margin: 0,
	},
	infosList: {
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("2w"),
		margin: 0,
		padding: 0,
	},
	infoItem: {
		display: "flex",
		alignItems: "flex-start",
		gap: fr.spacing("3v"),
	},
	infoIcon: {
		flexShrink: 0,
		marginTop: fr.spacing("3v"),
		color: fr.colors.decisions.text.actionHigh.blueFrance.default,
	},
	infoLabel: {
		padding: 0,
		fontSize: "0.875rem",
		lineHeight: "1.5rem",
		fontWeight: 400,
		color: fr.colors.decisions.text.mention.grey.default,
	},
	infoValue: {
		margin: 0,
		padding: 0,
		fontSize: "1rem",
		lineHeight: "1.5rem",
		fontWeight: 700,
		color: fr.colors.decisions.text.default.grey.default,
		"& + &": {
			marginTop: fr.spacing("1w"),
		},
	},
	tagsList: {
		paddingInlineStart: "0rem!important",
		marginBottom: "-0.5rem",
	},
	content: {
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("3w"),
		"& > *": {
			marginBottom: 0,
		},
	},
	description: {
		color: fr.colors.decisions.text.default.grey.default,
	},
	contentTitle: {
		color: fr.colors.decisions.text.title.grey.default,
	},
}));
