import { tss } from "tss-react/dsfr";

type HoneypotProps = {
	name: string;
	value: string;
	onChange: (value: string) => void;
};

export default function Honeypot({ name, value, onChange }: HoneypotProps) {
	const { classes } = useStyles();
	const inputId = `honeypot-${name}`;

	return (
		<div className={classes.wrapper} aria-hidden="true">
			<label htmlFor={inputId}>
				Ne remplissez pas ce champ si vous êtes humain.
			</label>
			<input
				id={inputId}
				type="text"
				name={name}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				tabIndex={-1}
				autoComplete="off"
			/>
		</div>
	);
}

const useStyles = tss.withName("Honeypot").create(() => ({
	wrapper: {
		position: "absolute",
		left: "-9999px",
		top: "auto",
		width: 1,
		height: 1,
		overflow: "hidden",
	},
}));
