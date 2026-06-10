import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { tss } from "tss-react/dsfr";
import Honeypot from "~/components/ui/Honeypot";
import { api } from "~/utils/api";
import { zodValidator } from "~/utils/contactForm";
import {
	contactProsCraSchema,
	PROFILE_LABELS,
	PROFILE_VALUES,
	type Profile,
	type Wish,
	WISH_LABELS,
	WISH_VALUES,
} from "~/utils/contactProsCra";

type FormShape = {
	profile: Profile;
	firstName: string;
	lastName: string;
	craName: string;
	craRole: string;
	wish: Wish | "";
	message: string;
	phone: string;
	email: string;
	website: string;
};

const initialValues: FormShape = {
	profile: PROFILE_VALUES[0],
	firstName: "",
	lastName: "",
	craName: "",
	craRole: "",
	wish: "",
	message: "",
	phone: "",
	email: "",
	website: "",
};

const MESSAGE_HINT = (
	<>
		Votre message doit comporter entre 15 et 1000 caractères maximum. Certains
		caractères spéciaux ne sont pas acceptés.
		<br />
		Attention à vos données ! Si nous vous encourageons à nous donner votre
		avis, nous vous demandons de ne pas nous transmettre d&apos;informations
		sensibles. Notamment, ne communiquez pas vos opinions philosophiques,
		syndicales ou politiques ; ces données sont trop personnelles !
	</>
);

const PHONE_HINT =
	"Format 10 chiffres attendu, sans espace, et sans caractère spécial. Exemple : 0122334455";

const EMAIL_HINT =
	"Format adresse courriel attendu. Exemple : jean.dupond@service.tld";

function firstErrorMessage(errors: ReadonlyArray<unknown>): string | undefined {
	const first = errors[0];
	if (!first) return undefined;
	if (typeof first === "string") return first;
	if (typeof first === "object" && first !== null && "message" in first) {
		const msg = (first as { message: unknown }).message;
		return typeof msg === "string" ? msg : undefined;
	}
	return undefined;
}

export default function ContactProsCraForm() {
	const { classes, cx } = useStyles();

	const submitMutation = api.contact.submitProsCra.useMutation();
	const [networkError, setNetworkError] = useState(false);
	const [success, setSuccess] = useState(false);

	const form = useForm({
		defaultValues: initialValues,
		validators: {
			onSubmit: zodValidator(contactProsCraSchema),
		},
		onSubmit: async ({ value, formApi }) => {
			setNetworkError(false);
			try {
				await submitMutation.mutateAsync({
					...value,
					wish: value.wish as Wish,
					phone: value.phone.trim() || undefined,
				});
				setSuccess(true);
				formApi.reset();
			} catch {
				setNetworkError(true);
			}
		},
	});

	if (success) {
		return (
			<div className={cx(classes.alertWrapper)}>
				<Alert
					severity="success"
					title="Votre message a bien été envoyé"
					description="Nous vous répondrons dans les meilleurs délais."
					closable
					onClose={() => setSuccess(false)}
				/>
			</div>
		);
	}

	return (
		<form
			noValidate
			className={cx(classes.form)}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				void form.handleSubmit().then(() => {
					requestAnimationFrame(() => {
						const firstErrorField = document.querySelector<HTMLElement>(
							".fr-input-group--error, .fr-select-group--error",
						);
						if (firstErrorField) {
							firstErrorField.scrollIntoView({
								behavior: "smooth",
								block: "center",
							});
							const focusable = firstErrorField.querySelector<HTMLElement>(
								"input, select, textarea",
							);
							focusable?.focus({ preventScroll: true });
						}
					});
				});
			}}
		>
			<p className={fr.cx("fr-text--sm", "fr-mb-2w")}>
				Sauf mention contraire, tous les champs sont obligatoires.
			</p>

			{networkError && (
				<div className={cx(classes.alertWrapper)}>
					<Alert
						severity="error"
						title="Une erreur est survenue"
						description="Merci de réessayer dans quelques instants."
						closable
						onClose={() => setNetworkError(false)}
					/>
				</div>
			)}

			<form.Field name="profile">
				{(field) => (
					<Select
						label="Votre profil"
						nativeSelectProps={{
							value: field.state.value,
							onChange: (e) => field.handleChange(e.target.value as Profile),
							onBlur: field.handleBlur,
							required: true,
							"aria-required": true,
							name: field.name,
						}}
						state={field.state.meta.errors.length > 0 ? "error" : "default"}
						stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
					>
						{PROFILE_VALUES.map((value) => (
							<option key={value} value={value}>
								{PROFILE_LABELS[value]}
							</option>
						))}
					</Select>
				)}
			</form.Field>

			<div className={cx(classes.row)}>
				<form.Field name="firstName">
					{(field) => (
						<Input
							label="Votre prénom"
							state={field.state.meta.errors.length > 0 ? "error" : "default"}
							stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
							nativeInputProps={{
								value: field.state.value,
								onChange: (e) => field.handleChange(e.target.value),
								onBlur: field.handleBlur,
								required: true,
								autoComplete: "given-name",
								name: field.name,
							}}
						/>
					)}
				</form.Field>
				<form.Field name="lastName">
					{(field) => (
						<Input
							label="Votre nom de famille"
							state={field.state.meta.errors.length > 0 ? "error" : "default"}
							stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
							nativeInputProps={{
								value: field.state.value,
								onChange: (e) => field.handleChange(e.target.value),
								onBlur: field.handleBlur,
								required: true,
								autoComplete: "family-name",
								name: field.name,
							}}
						/>
					)}
				</form.Field>
			</div>

			<form.Field name="craName">
				{(field) => (
					<Input
						label="Le nom de votre CRA"
						state={field.state.meta.errors.length > 0 ? "error" : "default"}
						stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
						nativeInputProps={{
							value: field.state.value,
							onChange: (e) => field.handleChange(e.target.value),
							onBlur: field.handleBlur,
							required: true,
							name: field.name,
						}}
					/>
				)}
			</form.Field>

			<form.Field name="craRole">
				{(field) => (
					<Input
						label="Votre fonction au sein du CRA"
						state={field.state.meta.errors.length > 0 ? "error" : "default"}
						stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
						nativeInputProps={{
							value: field.state.value,
							onChange: (e) => field.handleChange(e.target.value),
							onBlur: field.handleBlur,
							required: true,
							name: field.name,
						}}
					/>
				)}
			</form.Field>

			<form.Field name="wish">
				{(field) => (
					<Select
						label="Vous souhaitez"
						nativeSelectProps={{
							value: field.state.value,
							onChange: (e) => field.handleChange(e.target.value as Wish | ""),
							onBlur: field.handleBlur,
							required: true,
							"aria-required": true,
							name: field.name,
						}}
						state={field.state.meta.errors.length > 0 ? "error" : "default"}
						stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
					>
						<option value="" disabled>
							Sélectionnez une option
						</option>
						{WISH_VALUES.map((value) => (
							<option key={value} value={value}>
								{WISH_LABELS[value]}
							</option>
						))}
					</Select>
				)}
			</form.Field>

			<form.Field name="message">
				{(field) => (
					<Input
						label="Votre message"
						textArea
						hintText={MESSAGE_HINT}
						state={field.state.meta.errors.length > 0 ? "error" : "default"}
						stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
						nativeTextAreaProps={{
							value: field.state.value,
							onChange: (e) => field.handleChange(e.target.value),
							onBlur: field.handleBlur,
							required: true,
							rows: 6,
							maxLength: 1000,
							name: field.name,
						}}
					/>
				)}
			</form.Field>

			<form.Field name="phone">
				{(field) => (
					<Input
						label="Votre numéro de téléphone (optionnel)"
						hintText={PHONE_HINT}
						state={field.state.meta.errors.length > 0 ? "error" : "default"}
						stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
						nativeInputProps={{
							type: "tel",
							inputMode: "numeric",
							value: field.state.value,
							onChange: (e) => field.handleChange(e.target.value),
							onBlur: field.handleBlur,
							autoComplete: "tel",
							name: field.name,
						}}
					/>
				)}
			</form.Field>

			<form.Field name="website">
				{(field) => (
					<Honeypot
						name={field.name}
						value={field.state.value}
						onChange={field.handleChange}
					/>
				)}
			</form.Field>

			<form.Field name="email">
				{(field) => (
					<Input
						label="Votre email professionnel"
						hintText={EMAIL_HINT}
						state={field.state.meta.errors.length > 0 ? "error" : "default"}
						stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
						nativeInputProps={{
							type: "email",
							value: field.state.value,
							onChange: (e) => field.handleChange(e.target.value),
							onBlur: field.handleBlur,
							required: true,
							autoComplete: "email",
							name: field.name,
						}}
					/>
				)}
			</form.Field>

			<form.Subscribe selector={(state) => state.isSubmitting}>
				{(isSubmitting) => (
					<div className={cx(classes.actions)}>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Envoi en cours…" : "Envoyer"}
						</Button>
					</div>
				)}
			</form.Subscribe>
		</form>
	);
}

const useStyles = tss.withName(ContactProsCraForm.name).create(() => ({
	form: {
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("3w"),
	},
	row: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: fr.spacing("3w"),
		"& > .fr-input-group": {
			marginBottom: 0,
		},
		[fr.breakpoints.down("md")]: {
			gridTemplateColumns: "1fr",
		},
	},
	actions: {
		display: "flex",
		justifyContent: "flex-end",
	},
	alertWrapper: {
		marginBottom: fr.spacing("3w"),
	},
}));
