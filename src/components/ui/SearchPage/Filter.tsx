import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useState } from "react";
import type { FilterItem } from "~/components/PracticalGuides/GuidesFiltersDisplay";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useRouter } from "next/router";
import { deserialize } from "~/utils/tools";

type Props = {
	label: string;
	value: FilterItem[];
	handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Filter = ({ label, value, handleOnChange }: Props) => {
	const { breakpointsValues } = useBreakpointsValuesPx();

	const { windowInnerWidth } = useWindowInnerSize();

	const isMobile = windowInnerWidth < breakpointsValues.md;
	const [expand, setExpand] = useState<boolean>(!isMobile);

	const router = useRouter();
	const { conditions, themes, personas, type } = router.query;

	const isChecked = (slug: string) =>
		deserialize(conditions).includes(slug) ||
		deserialize(themes).includes(slug) ||
		deserialize(personas).includes(slug) ||
		deserialize(type).includes(slug);

	return (
		<Accordion
			label={label}
			onExpandedChange={() => setExpand((prev) => !prev)}
			expanded={expand}
		>
			<Checkbox
				options={value.map((item) => ({
					label: item.label,
					nativeInputProps: {
						value: String(item.slug),
						checked: isChecked(item.slug),
						onChange: handleOnChange,
					},
				}))}
			/>
		</Accordion>
	);
};
