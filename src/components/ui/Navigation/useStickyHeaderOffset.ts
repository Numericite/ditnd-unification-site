import { type RefObject, useEffect } from "react";

const DESKTOP_QUERY = "(min-width: 62em)";

/**
 * Publishes the pinned header height as CSS variables so the other sticky
 * elements (sommaire, sidebars) and anchor scrolling can keep their distance.
 */
export default function useStickyHeaderOffset(
	headerRef: RefObject<HTMLElement | null>,
) {
	useEffect(() => {
		const root = document.documentElement;
		const mediaQuery = window.matchMedia(DESKTOP_QUERY);

		const setOffsets = (hidden: number, pinned: number) => {
			root.style.setProperty("--sticky-header-hidden-height", `${hidden}px`);
			root.style.setProperty("--sticky-header-height", `${pinned}px`);
		};

		const measure = () => {
			const wrapper = headerRef.current;
			const header = wrapper?.querySelector(".fr-header");
			const headerBody = wrapper?.querySelector(".fr-header__body");
			if (!mediaQuery.matches || !header || !headerBody) {
				setOffsets(0, 0);
				return;
			}
			const hidden = headerBody.getBoundingClientRect().height;
			const pinned = header.getBoundingClientRect().height - hidden;
			setOffsets(hidden, Math.max(pinned, 0));
		};

		measure();

		const observer = new ResizeObserver(measure);
		if (headerRef.current) observer.observe(headerRef.current);
		mediaQuery.addEventListener("change", measure);

		return () => {
			observer.disconnect();
			mediaQuery.removeEventListener("change", measure);
			setOffsets(0, 0);
		};
	}, [headerRef]);
}
