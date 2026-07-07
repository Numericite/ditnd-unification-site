"use client";

import Link from "next/link";
import styles from "./SimplifiedContentGeneratorHeaderButton.module.css";
import SparklesIcon from "./SparklesIcon";

export default function SimplifiedContentGeneratorHeaderButton() {
	return (
		<Link
			className={styles.headerButton}
			href="/admin/simplified-content-generator"
			title="Générateur de contenu simplifié"
		>
			<span className={styles.icon} aria-hidden>
				<SparklesIcon />
			</span>
			<span className={styles.label}>Générateur de contenu simplifié</span>
		</Link>
	);
}
