"use client";
import { useRowLabel } from "@payloadcms/ui";
import { type TimeSlot, formatSlot, toMinuteSlots } from "~/utils/scheduleTime";

const TimeSlotRowLabel = () => {
	const { data, rowNumber } = useRowLabel<TimeSlot>();
	const [slot] = toMinuteSlots(data ? [data] : []);

	return (
		<span>
			{slot ? formatSlot(slot) : `Plage ${(rowNumber ?? 0) + 1} à compléter`}
		</span>
	);
};

export default TimeSlotRowLabel;
