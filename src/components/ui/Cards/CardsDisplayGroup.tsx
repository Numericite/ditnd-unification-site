import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import type { AugmentedCourse } from "~/server/api/routers/courses";

import CardDisplay from "./CardDisplay";

type Props = {
	guides?: AugmentedPracticalGuide[];
	courses?: AugmentedCourse[];
	className?: string;
	titleAs?: "h2" | "h3" | "h4" | "h5" | "h6" | undefined;
	kind: "guides" | "courses";
};

export default function CardsDisplayGroup({
	guides,
	courses,
	kind,
	className,
	titleAs,
}: Props) {
	const renderContent = () => {
		switch (kind) {
			case "courses":
				return (
					<>
						{courses?.map((course) =>
							course._status !== "draft" ? (
								<div
									key={course.id}
									className={className}
									style={{ display: "flex" }}
								>
									<CardDisplay
										{...course}
										imageUrl={course.image?.url ?? undefined}
										imageAlt={course.image?.alt}
										conditions={[course.condition]}
										themes={[course.theme]}
										redirect={`/`}
										titleAs={titleAs}
										kind={kind}
									/>
								</div>
							) : null,
						)}
					</>
				);
			case "guides":
				return (
					<>
						{guides?.map((guide) =>
							guide._status !== "draft" ? (
								<div
									key={guide.id}
									className={className}
									style={{ display: "flex" }}
								>
									<CardDisplay
										{...guide}
										imageUrl={guide.image?.url ?? undefined}
										imageAlt={guide.image?.alt}
										conditions={guide.conditions ?? []}
										themes={guide.themes}
										redirect={`/guides/${guide.slug}`}
										titleAs={titleAs}
										kind={kind}
									/>
								</div>
							) : null,
						)}
					</>
				);
		}
	};
	return renderContent();
}
