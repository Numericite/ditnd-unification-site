import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type {
	FilterItem,
	FiltersQuery,
} from "~/components/PracticalGuides/FiltersDisplay";

type Props = {
	label: string;
	collection: keyof FiltersQuery;
	value: FilterItem[];
	setFilters: Dispatch<SetStateAction<FiltersQuery>>;
};

export const Filter = ({ label, collection, value, setFilters }: Props) => {
	const isMobile = window.matchMedia("(max-width: 48em)").matches;
	const [expand, setExpand] = useState<boolean>(!isMobile);

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const slug = e.target.value;
		const checked = e.target.checked;

		setFilters((prev) => {
			const current = prev[collection];
			return {
				...prev,
				[collection]: checked
					? [...current, slug]
					: current.filter((value) => value !== slug),
			};
		});
	};

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
						value: String(item.id),
						onChange: handleOnChange,
					},
				}))}
			/>
		</Accordion>
	);
};
