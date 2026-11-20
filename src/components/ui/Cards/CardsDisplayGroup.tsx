import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import type { AugmentedCourse } from "~/server/api/routers/courses";
import type { PageCard } from "~/server/api/routers/pages";
import { courseFormatLabel } from "~/utils/courses";

import { buildCourseRedirect } from "~/utils/tools";
import CardDisplay from "./CardDisplay";

type Props = {
	guides?: AugmentedPracticalGuide[];
	courses?: AugmentedCourse[];
	pages?: PageCard[];
	className?: string;
	titleAs?: "h2" | "h3" | "h4" | "h5" | "h6" | undefined;
	kind: "guides" | "courses" | "pages";
	from?: string;
};

export default function CardsDisplayGroup({
	guides,
	courses,
	pages,
	kind,
	className,
	titleAs,
	from,
}: Props) {
	const buildGuideRedirect = (slug: string) => {
		const base = `/fiches-pratiques/${slug}`;
		return from ? `${base}?from=${encodeURIComponent(from)}` : base;
	};
	const renderContent = () => {
		switch (kind) {
			case "courses":
				return (
					<>
						{courses?.map((course) => (
							<div
								key={course.id}
								className={className}
								style={{ display: "flex" }}
							>
								<CardDisplay
									{...course}
									title={course.simplifiedTitle || course.title}
									imageUrl={
										course.image?.url ?? course.imageBanner?.url ?? undefined
									}
									imageAlt=""
									type={courseFormatLabel(course.format)}
									conditions={course.conditions}
									themes={course.themes}
									redirect={buildCourseRedirect(course)}
									titleAs={titleAs}
								/>
							</div>
						))}
					</>
				);
			case "guides":
				return (
					<>
						{guides?.map((guide) => (
							<div
								key={guide.id}
								className={className}
								style={{ display: "flex" }}
							>
								<CardDisplay
									{...guide}
									title={guide.simplifiedTitle || guide.title}
									imageUrl={guide.image?.url ?? undefined}
									imageAlt=""
									conditions={guide.conditions ?? []}
									themes={guide.themes}
									redirect={buildGuideRedirect(guide.slug)}
									titleAs={titleAs}
								/>
							</div>
						))}
					</>
				);
			case "pages":
				return (
					<>
						{pages?.map((page) => (
							<div
								key={page.id}
								className={className}
								style={{ display: "flex" }}
							>
								<CardDisplay
									title={page.title}
									description={page.description ?? undefined}
									imageUrl={page.imageUrl ?? undefined}
									imageAlt=""
									conditions={[]}
									themes={[]}
									redirect={page.href}
									titleAs={titleAs}
								/>
							</div>
						))}
					</>
				);
		}
	};
	return renderContent();
}
