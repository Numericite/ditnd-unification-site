import { useMemo } from "react";
import CmsPageLayout from "../ui/CmsPage/CmsPageLayout";
import type { AugmentedPracticalGuide } from "~/server/api/routers/practical-guides";
import type { Link } from "~/utils/tools";
import RecommendedContent from "./RecommendedContent";

export default function PracticalGuidesDisplay({
	guide,
}: {
	guide: AugmentedPracticalGuide;
}) {
	const extraLinks = useMemo<Link[]>(() => {
		const links: Link[] = [];

		if (guide["practical-guides"].length > 0) {
			links.push({
				linkProps: { href: "#fiches-pratiques" },
				text: "Ces fiches pratiques qui pourraient vous intéresser",
			});
		}

		if (guide.courses.length > 0) {
			links.push({
				linkProps: { href: "#formations" },
				text: "Ces formations qui pourraient vous intéresser",
			});
		}

		return links;
	}, [guide]);

	if (!guide.content) {
		return <p>Aucun contenu, veuillez bien remplir le contenu back office</p>;
	}

	return (
		<CmsPageLayout
			title={guide.title}
			content={guide.content}
			imageBanner={guide.imageBanner}
			createdAt={guide.createdAt}
			updatedAt={guide.updatedAt}
			showShareSocials
			extraLinks={extraLinks}
		>
			<RecommendedContent
				guides={guide["practical-guides"]}
				courses={guide.courses}
			/>
		</CmsPageLayout>
	);
}
