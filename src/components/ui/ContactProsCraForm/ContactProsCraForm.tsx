import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { useState } from "react";
import { tss } from "tss-react/dsfr";
import { api } from "~/utils/api";

type FieldName =
	| "profile"
	| "firstName"
	| "lastName"
	| "craName"
	| "craRole"
	| "wish"
	| "message"
	| "phone"
	| "email";

type FormValues = Record<FieldName, string>;

type FormErrors = Partial<Record<FieldName, string>>;

const PROFILE_OPTIONS = [
	{ value: "pro-cra", label: "Un professionnel de CRA" },
] as const;

const WISH_OPTIONS = [
	{
		value: "newsletter",
		label: "Vous inscrire à la newsletter (pour les pros des CRA)",
	},
	{ value: "propose-content", label: "Proposer un contenu" },
	{
		value: "other",
		label: 'Autre (précisez dans le champ "Votre message")',
	},
] as const;

const MESSAGE_HINT = (
	<>
		Votre message doit comporter entre 15 et 1000 caractères maximum. Certains
		caractères spéciaux ne sont pas acceptés.
		<br />
		Attention à vos données ! Si nous vous encourageons à nous donner votre
		avis, nous ne vous demandons de ne pas nous transmettre d&apos;informations
		sensibles. Notamment, ne communiquez pas vos opinions philosophiques,
		syndicales ou politiques ; ces données sont trop personnelles !
	</>
);

const PHONE_HINT =
	"Format 10 chiffres attendu, sans espace, et sans caractère spécial. Exemple : 0122334455";

const EMAIL_HINT =
	"Format adresse courriel attendu. Exemple : jean.dupond@service.tld";

const INVALID_MESSAGE_REGEX = /[<>{}[\]\\]/;

const initialValues: FormValues = {
	profile: PROFILE_OPTIONS[0].value,
	firstName: "",
	lastName: "",
	craName: "",
	craRole: "",
	wish: "",
	message: "",
	phone: "",
	email: "",
};

function validate(values: FormValues): FormErrors {
	const errors: FormErrors = {};

	if (!values.profile) errors.profile = "Veuillez sélectionner votre profil.";
	if (!values.firstName.trim())
		errors.firstName = "Veuillez renseigner votre prénom.";
	if (!values.lastName.trim())
		errors.lastName = "Veuillez renseigner votre nom de famille.";
	if (!values.craName.trim())
		errors.craName = "Veuillez renseigner le nom de votre CRA.";
	if (!values.craRole.trim())
		errors.craRole = "Veuillez renseigner votre fonction au sein du CRA.";
	if (!values.wish) errors.wish = "Veuillez sélectionner une option.";

	const trimmedMessage = values.message.trim();
	if (!trimmedMessage) {
		errors.message = "Veuillez renseigner votre message.";
	} else if (trimmedMessage.length < 15) {
		errors.message = "Votre message doit comporter au moins 15 caractères.";
	} else if (trimmedMessage.length > 1000) {
		errors.message = "Votre message ne doit pas dépasser 1000 caractères.";
	} else if (INVALID_MESSAGE_REGEX.test(trimmedMessage)) {
		errors.message =
			"Votre message contient des caractères spéciaux non autorisés.";
	}

	if (values.phone.trim() && !/^\d{10}$/.test(values.phone.trim())) {
		errors.phone =
			"Le numéro doit être composé de 10 chiffres sans espace ni caractère spécial.";
	}

	const trimmedEmail = values.email.trim();
	if (!trimmedEmail) {
		errors.email = "Veuillez renseigner votre email professionnel.";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
		errors.email = "Veuillez renseigner une adresse email valide.";
	}

	return errors;
}

export default function ContactProsCraForm() {
	const { classes, cx } = useStyles();

	const [values, setValues] = useState<FormValues>(initialValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitState, setSubmitState] = useState<
		"idle" | "submitting" | "success" | "error"
	>("idle");

	const submitMutation = api.contact.submitProsCra.useMutation();

	const updateField = (field: FieldName, value: string) => {
		setValues((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validation = validate(values);
		setErrors(validation);

		if (Object.keys(validation).length > 0) {
			setSubmitState("error");
			requestAnimationFrame(() => {
				const firstErrorField = document.querySelector<HTMLElement>(
					".fr-input-group--error, .fr-select-group--error",
				);
				firstErrorField?.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			});
			return;
		}

		setSubmitState("submitting");

		try {
			await submitMutation.mutateAsync({
				profile: values.profile as "pro-cra",
				firstName: values.firstName.trim(),
				lastName: values.lastName.trim(),
				craName: values.craName.trim(),
				craRole: values.craRole.trim(),
				wish: values.wish as "newsletter" | "propose-content" | "other",
				message: values.message.trim(),
				phone: values.phone.trim() || undefined,
				email: values.email.trim(),
			});

			setSubmitState("success");
			setValues(initialValues);
		} catch {
			setSubmitState("error");
			setErrors({});
		}
	};

	const getFieldState = (field: FieldName) =>
		errors[field] ? "error" : "default";

	if (submitState === "success") {
		return (
			<div className={cx(classes.alertWrapper)}>
				<Alert
					severity="success"
					title="Votre message a bien été envoyé"
					description="Nous vous répondrons dans les meilleurs délais."
					closable
					onClose={() => setSubmitState("idle")}
				/>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} noValidate className={cx(classes.form)}>
			<p className={fr.cx("fr-text--sm", "fr-mb-2w")}>
				Sauf mention contraire, tous les champs sont obligatoires.
			</p>

			{submitState === "error" && Object.keys(errors).length === 0 && (
				<div className={cx(classes.alertWrapper)}>
					<Alert
						severity="error"
						title="Une erreur est survenue"
						description="Merci de réessayer dans quelques instants."
						closable
						onClose={() => setSubmitState("idle")}
					/>
				</div>
			)}

			<Select
				label="Votre profil"
				nativeSelectProps={{
					value: values.profile,
					onChange: (e) => updateField("profile", e.target.value),
					required: true,
					"aria-required": true,
					name: "profile",
				}}
				state={getFieldState("profile")}
				stateRelatedMessage={errors.profile}
			>
				{PROFILE_OPTIONS.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</Select>

			<div className={cx(classes.row)}>
				<Input
					label="Votre prénom"
					state={getFieldState("firstName")}
					stateRelatedMessage={errors.firstName}
					nativeInputProps={{
						value: values.firstName,
						onChange: (e) => updateField("firstName", e.target.value),
						required: true,
						autoComplete: "given-name",
						name: "firstName",
					}}
				/>
				<Input
					label="Votre nom de famille"
					state={getFieldState("lastName")}
					stateRelatedMessage={errors.lastName}
					nativeInputProps={{
						value: values.lastName,
						onChange: (e) => updateField("lastName", e.target.value),
						required: true,
						autoComplete: "family-name",
						name: "lastName",
					}}
				/>
			</div>

			<Input
				label="Le nom de votre CRA"
				state={getFieldState("craName")}
				stateRelatedMessage={errors.craName}
				nativeInputProps={{
					value: values.craName,
					onChange: (e) => updateField("craName", e.target.value),
					required: true,
					name: "craName",
				}}
			/>

			<Input
				label="Votre fonction au sein du CRA"
				state={getFieldState("craRole")}
				stateRelatedMessage={errors.craRole}
				nativeInputProps={{
					value: values.craRole,
					onChange: (e) => updateField("craRole", e.target.value),
					required: true,
					name: "craRole",
				}}
			/>

			<Select
				label="Vous souhaitez"
				nativeSelectProps={{
					value: values.wish,
					onChange: (e) => updateField("wish", e.target.value),
					required: true,
					"aria-required": true,
					name: "wish",
				}}
				state={getFieldState("wish")}
				stateRelatedMessage={errors.wish}
			>
				<option value="" disabled>
					Sélectionnez une option
				</option>
				{WISH_OPTIONS.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</Select>

			<Input
				label="Votre message"
				textArea
				hintText={MESSAGE_HINT}
				state={getFieldState("message")}
				stateRelatedMessage={errors.message}
				nativeTextAreaProps={{
					value: values.message,
					onChange: (e) => updateField("message", e.target.value),
					required: true,
					rows: 6,
					maxLength: 1000,
					name: "message",
				}}
			/>

			<Input
				label="Votre numéro de téléphone (optionnel)"
				hintText={PHONE_HINT}
				state={getFieldState("phone")}
				stateRelatedMessage={errors.phone}
				nativeInputProps={{
					type: "tel",
					inputMode: "numeric",
					value: values.phone,
					onChange: (e) => updateField("phone", e.target.value),
					autoComplete: "tel",
					name: "phone",
				}}
			/>

			<Input
				label="Votre email professionnel"
				hintText={EMAIL_HINT}
				state={getFieldState("email")}
				stateRelatedMessage={errors.email}
				nativeInputProps={{
					type: "email",
					value: values.email,
					onChange: (e) => updateField("email", e.target.value),
					required: true,
					autoComplete: "email",
					name: "email",
				}}
			/>

			<div className={cx(classes.actions)}>
				<Button type="submit" disabled={submitState === "submitting"}>
					{submitState === "submitting" ? "Envoi en cours…" : "Envoyer"}
				</Button>
			</div>
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
