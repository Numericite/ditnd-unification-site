import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useState } from "react";
import type { FilterItem } from "~/components/PracticalGuides/FiltersDisplay";

type FilterProps = {
  label: string;
  value: FilterItem[];
};

export const Filter = ({ label, value }: FilterProps) => {
  const [expand, setExpand] = useState<boolean>(true);
  return (
    <Accordion
      label={label}
      onExpandedChange={() => setExpand(!expand)}
      expanded={expand}
    >
      <Checkbox
        options={value.map((item) => ({
          label: item.label,
          nativeInputProps: {
            value: String(item.id),
          },
        }))}
      />
    </Accordion>
  );
};
