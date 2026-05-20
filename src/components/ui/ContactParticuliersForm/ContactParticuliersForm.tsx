import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { tss } from "tss-react/dsfr";
import Honeypot from "~/components/ui/Honeypot";
import { api } from "~/utils/api";
import { zodValidator } from "~/utils/contactForm";
import {
	AGE_RANGE_VALUES,
	type AgeRange,
	CIVILITY_VALUES,
	type Civility,
	CLASSIFICATION_VALUES,
	type Classification,
	contactParticuliersSchema,
	DEPARTEMENT_VALUES,
	OBJET_VALUES,
	type Objet,
	SEXE_VALUES,
	type Sexe,
} from "~/utils/contactParticuliers";

type FormShape = {
	civility: Civility | "";
	lastName: string;
	firstName: string;
	email: string;
	departement: string;
	objet: Objet | "";
	classification: Classification | "";
	sexe: Sexe | "";
	ageRange: AgeRange | "";
	message: string;
	newsletter: boolean;
	consent: boolean;
	website: string;
};

const initialValues: FormShape = {
	civility: "",
	lastName: "",
	firstName: "",
	email: "",
	departement: "",
	objet: "",
	classification: "",
	sexe: "",
	ageRange: "",
	message: "",
	newsletter: false,
	consent: false,
	website: "",
};

const MESSAGE_HINT = (
	<>
		Votre message doit comporter entre 15 et 2000 caractères maximum. Certains
		caractères spéciaux ne sont pas acceptés.
		<br />
		Attention à vos données ! Si nous vous encourageons à nous donner votre
		avis, nous vous demandons de ne pas nous transmettre d&apos;informations
		sensibles. Notamment, ne communiquez pas vos opinions philosophiques,
		syndicales ou politiques ; ces données sont trop personnelles !
	</>
);

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

export default function ContactParticuliersForm() {
	const { classes, cx } = useStyles();

	const submitMutation = api.contact.submitParticuliers.useMutation();
	const [networkError, setNetworkError] = useState(false);
	const [success, setSuccess] = useState(false);

	const form = useForm({
		defaultValues: initialValues,
		validators: {
			onSubmit: zodValidator(contactParticuliersSchema),
		},
		onSubmit: async ({ value, formApi }) => {
			setNetworkError(false);
			try {
				await submitMutation.mutateAsync({
					civility: value.civility || undefined,
					lastName: value.lastName,
					firstName: value.firstName,
					email: value.email,
					departement: value.departement || undefined,
					objet: value.objet as Objet,
					classification: value.classification as Classification,
					sexe: value.sexe || undefined,
					ageRange: value.ageRange || undefined,
					message: value.message,
					newsletter: value.newsletter,
					consent: true,
					website: value.website,
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
							".fr-input-group--error, .fr-select-group--error, .fr-fieldset--error",
						);
						firstErrorField?.scrollIntoView({
							behavior: "smooth",
							block: "center",
						});
					});
				});
			}}
		>
			<p className={fr.cx("fr-text--sm", "fr-mb-2w")}>
				Les champs suivis d&apos;un astérisque (*) sont obligatoires.
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

			<form.Field name="civility">
				{(field) => (
					<RadioButtons
						legend="Civilité"
						orientation="horizontal"
						options={CIVILITY_VALUES.map((opt) => ({
							label: opt,
							nativeInputProps: {
								name: field.name,
								value: opt,
								checked: field.state.value === opt,
								onChange: () => field.handleChange(opt),
							},
						}))}
					/>
				)}
			</form.Field>

			<div className={cx(classes.row)}>
				<form.Field name="lastName">
					{(field) => (
						<Input
							label="Nom *"
							state={field.state.meta.errors.length > 0 ? "error" : "default"}
							stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
							nativeInputProps={{
								value: field.state.value,
								onChange: (e) => field.handleChange(e.target.value),
								onBlur: field.handleBlur,
								required: true,
								maxLength: 255,
								autoComplete: "family-name",
								placeholder: "Indiquez votre nom",
								name: field.name,
							}}
						/>
					)}
				</form.Field>
				<form.Field name="firstName">
					{(field) => (
						<Input
							label="Prénom *"
							state={field.state.meta.errors.length > 0 ? "error" : "default"}
							stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
							nativeInputProps={{
								value: field.state.value,
								onChange: (e) => field.handleChange(e.target.value),
								onBlur: field.handleBlur,
								required: true,
								maxLength: 255,
								autoComplete: "given-name",
								placeholder: "Indiquez votre prénom",
								name: field.name,
							}}
						/>
					)}
				</form.Field>
			</div>
			<form.Field name="email">
				{(field) => (
					<Input
						label="Courriel *"
						hintText={EMAIL_HINT}
						state={field.state.meta.errors.length > 0 ? "error" : "default"}
						stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
						nativeInputProps={{
							type: "email",
							value: field.state.value,
							onChange: (e) => field.handleChange(e.target.value),
							onBlur: field.handleBlur,
							required: true,
							maxLength: 254,
							autoComplete: "email",
							placeholder: "Indiquez votre courriel",
							name: field.name,
						}}
					/>
				)}
			</form.Field>

			<form.Field name="departement">
				{(field) => (
					<Select
						label="Département"
						nativeSelectProps={{
							value: field.state.value,
							onChange: (e) => field.handleChange(e.target.value),
							onBlur: field.handleBlur,
							name: field.name,
						}}
					>
						<option value="">- Aucun(e) -</option>
						{DEPARTEMENT_VALUES.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</Select>
				)}
			</form.Field>

			<h2 className={fr.cx("fr-h3", "fr-mt-4w", "fr-mb-1w")}>Votre demande</h2>

			<div className={cx(classes.row)}>
				<form.Field name="objet">
					{(field) => (
						<Select
							label="Objet de la demande *"
							nativeSelectProps={{
								value: field.state.value,
								onChange: (e) =>
									field.handleChange(e.target.value as Objet | ""),
								onBlur: field.handleBlur,
								required: true,
								"aria-required": true,
								name: field.name,
							}}
							state={field.state.meta.errors.length > 0 ? "error" : "default"}
							stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
						>
							<option value="" disabled>
								Quel est l&apos;objet de votre demande ?
							</option>
							{OBJET_VALUES.map((opt) => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</Select>
					)}
				</form.Field>
				<form.Field name="classification">
					{(field) => (
						<Select
							label="Classification *"
							nativeSelectProps={{
								value: field.state.value,
								onChange: (e) =>
									field.handleChange(e.target.value as Classification | ""),
								onBlur: field.handleBlur,
								required: true,
								"aria-required": true,
								name: field.name,
							}}
							state={field.state.meta.errors.length > 0 ? "error" : "default"}
							stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
						>
							<option value="" disabled>
								Qui êtes-vous ?
							</option>
							{CLASSIFICATION_VALUES.map((opt) => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</Select>
					)}
				</form.Field>
			</div>

			<div className={cx(classes.row)}>
				<form.Field name="sexe">
					{(field) => (
						<Select
							label="Sexe de la personne concernée"
							nativeSelectProps={{
								value: field.state.value,
								onChange: (e) =>
									field.handleChange(e.target.value as Sexe | ""),
								onBlur: field.handleBlur,
								name: field.name,
							}}
						>
							<option value="">
								Indiquez le sexe de la personne concernée
							</option>
							{SEXE_VALUES.map((opt) => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</Select>
					)}
				</form.Field>
				<form.Field name="ageRange">
					{(field) => (
						<Select
							label="Tranche d'âge"
							nativeSelectProps={{
								value: field.state.value,
								onChange: (e) =>
									field.handleChange(e.target.value as AgeRange | ""),
								onBlur: field.handleBlur,
								name: field.name,
							}}
						>
							<option value="">
								Choisissez l&apos;âge de la personne concernée
							</option>
							{AGE_RANGE_VALUES.map((opt) => (
								<option key={opt} value={opt}>
									{opt}
								</option>
							))}
						</Select>
					)}
				</form.Field>
			</div>

			<form.Field name="message">
				{(field) => (
					<Input
						label="Message *"
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
							maxLength: 2000,
							placeholder: "Votre message",
							name: field.name,
						}}
					/>
				)}
			</form.Field>

			<form.Field name="newsletter">
				{(field) => (
					<Checkbox
						options={[
							{
								label:
									"J'accepte de recevoir la newsletter Maison de l'autisme.",
								nativeInputProps: {
									name: field.name,
									checked: field.state.value,
									onChange: (e) => field.handleChange(e.target.checked),
								},
							},
						]}
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

			<form.Field name="consent">
				{(field) => (
					<Checkbox
						state={field.state.meta.errors.length > 0 ? "error" : "default"}
						stateRelatedMessage={firstErrorMessage(field.state.meta.errors)}
						options={[
							{
								label:
									"En soumettant ce formulaire j'accepte que les informations saisies soient exploitées pour permettre de me recontacter. *",
								nativeInputProps: {
									name: field.name,
									checked: field.state.value,
									onChange: (e) => field.handleChange(e.target.checked),
									required: true,
								},
							},
						]}
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

const useStyles = tss.withName(ContactParticuliersForm.name).create(() => ({
	form: {
		display: "flex",
		flexDirection: "column",
		gap: fr.spacing("3w"),
	},
	row: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: fr.spacing("3w"),
		"& > .fr-input-group, & > .fr-select-group": {
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
