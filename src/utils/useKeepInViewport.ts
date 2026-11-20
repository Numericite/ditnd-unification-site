import { type RefObject, useLayoutEffect } from "react";

// Shifts an absolutely positioned element horizontally, only by what is needed
// to keep it inside the viewport. Uses the `translate` property so the
// element's own `transform` (e.g. centering) is preserved.
export function useKeepInViewport(
	ref: RefObject<HTMLElement | null>,
	active: boolean,
	margin = 16,
): void {
	useLayoutEffect(() => {
		const element = ref.current;
		if (!active || !element) return;

		const reposition = () => {
			const currentShift = Number.parseFloat(element.style.translate) || 0;
			const { left, width } = element.getBoundingClientRect();
			const naturalLeft = left - currentShift;
			const maxLeft = document.documentElement.clientWidth - margin - width;
			const shift =
				naturalLeft < margin
					? margin - naturalLeft
					: Math.min(0, maxLeft - naturalLeft);
			element.style.translate = shift ? `${shift}px 0` : "";
		};

		reposition();
		window.addEventListener("resize", reposition);
		return () => window.removeEventListener("resize", reposition);
	}, [ref, active, margin]);
}
