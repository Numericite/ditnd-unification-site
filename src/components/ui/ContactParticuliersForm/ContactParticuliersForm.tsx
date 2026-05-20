import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { useState } from "react";
import { tss } from "tss-react/dsfr";
import { api } from "~/utils/api";

const CIVILITY_OPTIONS = ["Madame", "Monsieur"] as const;
type Civility = (typeof CIVILITY_OPTIONS)[number];

const SEXE_OPTIONS = ["Féminin", "Masculin"] as const;
type Sexe = (typeof SEXE_OPTIONS)[number];

const AGE_RANGE_OPTIONS = [
	"De 0 à 3 ans",
	"De 4 à 12 ans",
	"De 13 à 18 ans",
	"De 18 à 25 ans",
	"De 26 à 50 ans",
	"Plus de 50 ans",
] as const;
type AgeRange = (typeof AGE_RANGE_OPTIONS)[number];

const OBJET_OPTIONS = [
	"Diagnostic",
	"Santé",
	"Social",
	"Éducation",
	"Accompagnement",
	"Droit",
	"Autre",
] as const;
type Objet = (typeof OBJET_OPTIONS)[number];

const CLASSIFICATION_OPTIONS = [
	"Usager concerné",
	"Parent d’un enfant concerné",
	"Proche d'une personne concernée",
	"Professionnel de santé",
	"Professionnel encadrant",
	"Enseignant",
	"Membre associatif",
	"Journaliste",
	"Partenaire",
	"Autre",
] as const;
type Classification = (typeof CLASSIFICATION_OPTIONS)[number];

const DEPARTEMENT_OPTIONS = [
	"01 - Ain",
	"02 - Aisne",
	"03 - Allier",
	"04 - Alpes-de-Haute-Provence",
	"05 - Hautes-Alpes",
	"06 - Alpes-Maritimes",
	"07 - Ardèche",
	"08 - Ardennes",
	"09 - Ariège",
	"10 - Aube",
	"11 - Aude",
	"12 - Aveyron",
	"13 - Bouches-du-Rhône",
	"14 - Calvados",
	"15 - Cantal",
	"16 - Charente",
	"17 - Charente-Maritime",
	"18 - Cher",
	"19 - Corrèze",
	"20 - Corse",
	"21 - Côte-d'Or",
	"22 - Côtes-d'Armor",
	"23 - Creuse",
	"24 - Dordogne",
	"25 - Doubs",
	"26 - Drôme",
	"27 - Eure",
	"28 - Eure-et-Loir",
	"29 - Finistère",
	"30 - Gard",
	"31 - Haute-Garonne",
	"32 - Gers",
	"33 - Gironde",
	"34 - Hérault",
	"35 - Ille-et-Vilaine",
	"36 - Indre",
	"37 - Indre-et-Loire",
	"38 - Isère",
	"39 - Jura",
	"40 - Landes",
	"41 - Loir-et-Cher",
	"42 - Loire",
	"43 - Haute-Loire",
	"44 - Loire-Atlantique",
	"45 - Loiret",
	"46 - Lot",
	"47 - Lot-et-Garonne",
	"48 - Lozère",
	"49 - Maine-et-Loire",
	"50 - Manche",
	"51 - Marne",
	"52 - Haute-Marne",
	"53 - Mayenne",
	"54 - Meurthe-et-Moselle",
	"55 - Meuse",
	"56 - Morbihan",
	"57 - Moselle",
	"58 - Nièvre",
	"59 - Nord",
	"60 - Oise",
	"61 - Orne",
	"62 - Pas-de-Calais",
	"63 - Puy-de-Dôme",
	"64 - Pyrenées-Atlantiques",
	"65 - Hautes-Pyrenées",
	"66 - Pyrenées-Orientales",
	"67 - Bas-Rhin",
	"68 - Haut-Rhin",
	"69 - Rhône",
	"70 - Haute-Saône",
	"71 - Saône-et-Loire",
	"72 - Sarthe",
	"73 - Savoie",
	"74 - Haute-Savoie",
	"75 - Paris",
	"76 - Seine-Maritime",
	"77 - Seine-et-Marne",
	"78 - Yvelines",
	"79 - Deux-Sèvres",
	"80 - Somme",
	"81 - Tarn",
	"82 - Tarn-et-Garonne",
	"83 - Var",
	"84 - Vaucluse",
	"85 - Vendée",
	"86 - Vienne",
	"87 - Haute-Vienne",
	"88 - Vosges",
	"89 - Yonne",
	"90 - Territoire de Belfort",
	"91 - Essonne",
	"92 - Hauts-de-Seine",
	"93 - Seine-Saint-Denis",
	"94 - Val-de-Marne",
	"95 - Val-d'Oise",
	"971 - Guadeloupe",
	"972 - Martinique",
	"973 - Guyane",
	"974 - La Réunion",
	"975 - Mayotte",
] as const;

type FieldName =
	| "civility"
	| "lastName"
	| "firstName"
	| "email"
	| "emailConfirmation"
	| "departement"
	| "objet"
	| "classification"
	| "sexe"
	| "ageRange"
	| "message"
	| "newsletter"
	| "consent";

type FormValues = {
	civility: Civility | "";
	lastName: string;
	firstName: string;
	email: string;
	emailConfirmation: string;
	departement: string;
	objet: Objet | "";
	classification: Classification | "";
	sexe: Sexe | "";
	ageRange: AgeRange | "";
	message: string;
	newsletter: boolean;
	consent: boolean;
};

type FormErrors = Partial<Record<FieldName, string>>;

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

const INVALID_MESSAGE_REGEX = /[<>{}[\]\\]/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues: FormValues = {
	civility: "",
	lastName: "",
	firstName: "",
	email: "",
	emailConfirmation: "",
	departement: "",
	objet: "",
	classification: "",
	sexe: "",
	ageRange: "",
	message: "",
	newsletter: false,
	consent: false,
};

function validate(values: FormValues): FormErrors {
	const errors: FormErrors = {};

	if (!values.lastName.trim())
		errors.lastName = "Veuillez renseigner votre nom.";
	if (!values.firstName.trim())
		errors.firstName = "Veuillez renseigner votre prénom.";

	const trimmedEmail = values.email.trim();
	if (!trimmedEmail) {
		errors.email = "Veuillez renseigner votre courriel.";
	} else if (!EMAIL_REGEX.test(trimmedEmail)) {
		errors.email = "Veuillez renseigner une adresse email valide.";
	}

	const trimmedEmailConfirmation = values.emailConfirmation.trim();
	if (!trimmedEmailConfirmation) {
		errors.emailConfirmation = "Veuillez confirmer votre courriel.";
	} else if (trimmedEmail && trimmedEmail !== trimmedEmailConfirmation) {
		errors.emailConfirmation =
			"Les adresses email saisies ne correspondent pas.";
	}

	if (!values.objet)
		errors.objet = "Veuillez sélectionner l'objet de votre demande.";
	if (!values.classification)
		errors.classification = "Veuillez sélectionner une option.";

	const trimmedMessage = values.message.trim();
	if (!trimmedMessage) {
		errors.message = "Veuillez renseigner votre message.";
	} else if (trimmedMessage.length < 15) {
		errors.message = "Votre message doit comporter au moins 15 caractères.";
	} else if (trimmedMessage.length > 2000) {
		errors.message = "Votre message ne doit pas dépasser 2000 caractères.";
	} else if (INVALID_MESSAGE_REGEX.test(trimmedMessage)) {
		errors.message =
			"Votre message contient des caractères spéciaux non autorisés.";
	}

	if (!values.consent) {
		errors.consent = "Vous devez accepter pour soumettre le formulaire.";
	}

	return errors;
}

export default function ContactParticuliersForm() {
	const { classes, cx } = useStyles();

	const [values, setValues] = useState<FormValues>(initialValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitState, setSubmitState] = useState<
		"idle" | "submitting" | "success" | "error"
	>("idle");

	const submitMutation = api.contact.submitParticuliers.useMutation();

	const updateField = <K extends FieldName>(field: K, value: FormValues[K]) => {
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
					".fr-input-group--error, .fr-select-group--error, .fr-fieldset--error",
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
				civility: values.civility || undefined,
				lastName: values.lastName.trim(),
				firstName: values.firstName.trim(),
				email: values.email.trim(),
				emailConfirmation: values.emailConfirmation.trim(),
				departement: values.departement || undefined,
				objet: values.objet as Objet,
				classification: values.classification as Classification,
				sexe: values.sexe || undefined,
				ageRange: values.ageRange || undefined,
				message: values.message.trim(),
				newsletter: values.newsletter,
				consent: true,
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
				Les champs suivis d&apos;un astérisque (*) sont obligatoires.
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

			<RadioButtons
				legend="Civilité"
				orientation="horizontal"
				options={CIVILITY_OPTIONS.map((opt) => ({
					label: opt,
					nativeInputProps: {
						name: "civility",
						value: opt,
						checked: values.civility === opt,
						onChange: () => updateField("civility", opt),
					},
				}))}
			/>

			<div className={cx(classes.row)}>
				<Input
					label="Nom *"
					state={getFieldState("lastName")}
					stateRelatedMessage={errors.lastName}
					nativeInputProps={{
						value: values.lastName,
						onChange: (e) => updateField("lastName", e.target.value),
						required: true,
						maxLength: 255,
						autoComplete: "family-name",
						placeholder: "Indiquez votre nom",
						name: "lastName",
					}}
				/>
				<Input
					label="Prénom *"
					state={getFieldState("firstName")}
					stateRelatedMessage={errors.firstName}
					nativeInputProps={{
						value: values.firstName,
						onChange: (e) => updateField("firstName", e.target.value),
						required: true,
						maxLength: 255,
						autoComplete: "given-name",
						placeholder: "Indiquez votre prénom",
						name: "firstName",
					}}
				/>
			</div>

			<div className={cx(classes.row)}>
				<Input
					label="Courriel *"
					hintText={EMAIL_HINT}
					state={getFieldState("email")}
					stateRelatedMessage={errors.email}
					nativeInputProps={{
						type: "email",
						value: values.email,
						onChange: (e) => updateField("email", e.target.value),
						required: true,
						maxLength: 254,
						autoComplete: "email",
						placeholder: "Indiquez votre courriel",
						name: "email",
					}}
				/>
				<Input
					label="Confirmation de courriel *"
					state={getFieldState("emailConfirmation")}
					stateRelatedMessage={errors.emailConfirmation}
					nativeInputProps={{
						type: "email",
						value: values.emailConfirmation,
						onChange: (e) => updateField("emailConfirmation", e.target.value),
						required: true,
						maxLength: 254,
						autoComplete: "email",
						placeholder: "Confirmez votre courriel",
						onPaste: (e) => e.preventDefault(),
						name: "emailConfirmation",
					}}
				/>
			</div>

			<Select
				label="Département"
				nativeSelectProps={{
					value: values.departement,
					onChange: (e) => updateField("departement", e.target.value),
					name: "departement",
				}}
			>
				<option value="">- Aucun(e) -</option>
				{DEPARTEMENT_OPTIONS.map((opt) => (
					<option key={opt} value={opt}>
						{opt}
					</option>
				))}
			</Select>

			<h2 className={fr.cx("fr-h3", "fr-mt-4w", "fr-mb-1w")}>Votre demande</h2>

			<div className={cx(classes.row)}>
				<Select
					label="Objet de la demande *"
					nativeSelectProps={{
						value: values.objet,
						onChange: (e) => updateField("objet", e.target.value as Objet | ""),
						required: true,
						"aria-required": true,
						name: "objet",
					}}
					state={getFieldState("objet")}
					stateRelatedMessage={errors.objet}
				>
					<option value="" disabled>
						Quel est l&apos;objet de votre demande ?
					</option>
					{OBJET_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</Select>
				<Select
					label="Classification *"
					nativeSelectProps={{
						value: values.classification,
						onChange: (e) =>
							updateField(
								"classification",
								e.target.value as Classification | "",
							),
						required: true,
						"aria-required": true,
						name: "classification",
					}}
					state={getFieldState("classification")}
					stateRelatedMessage={errors.classification}
				>
					<option value="" disabled>
						Qui êtes-vous ?
					</option>
					{CLASSIFICATION_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</Select>
			</div>

			<div className={cx(classes.row)}>
				<Select
					label="Sexe de la personne concernée"
					nativeSelectProps={{
						value: values.sexe,
						onChange: (e) => updateField("sexe", e.target.value as Sexe | ""),
						name: "sexe",
					}}
				>
					<option value="">Indiquez le sexe de la personne concernée</option>
					{SEXE_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</Select>
				<Select
					label="Tranche d'âge"
					nativeSelectProps={{
						value: values.ageRange,
						onChange: (e) =>
							updateField("ageRange", e.target.value as AgeRange | ""),
						name: "ageRange",
					}}
				>
					<option value="">
						Choisissez l&apos;âge de la personne concernée
					</option>
					{AGE_RANGE_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</Select>
			</div>

			<Input
				label="Message *"
				textArea
				hintText={MESSAGE_HINT}
				state={getFieldState("message")}
				stateRelatedMessage={errors.message}
				nativeTextAreaProps={{
					value: values.message,
					onChange: (e) => updateField("message", e.target.value),
					required: true,
					rows: 6,
					maxLength: 2000,
					placeholder: "Votre message",
					name: "message",
				}}
			/>

			<Checkbox
				options={[
					{
						label: "J'accepte de recevoir la newsletter Maison de l'autisme.",
						nativeInputProps: {
							name: "newsletter",
							checked: values.newsletter,
							onChange: (e) => updateField("newsletter", e.target.checked),
						},
					},
				]}
			/>

			<Checkbox
				state={getFieldState("consent")}
				stateRelatedMessage={errors.consent}
				options={[
					{
						label:
							"En soumettant ce formulaire j'accepte que les informations saisies soient exploitées pour permettre de me recontacter. *",
						nativeInputProps: {
							name: "consent",
							checked: values.consent,
							onChange: (e) => updateField("consent", e.target.checked),
							required: true,
						},
					},
				]}
			/>

			<div className={cx(classes.actions)}>
				<Button type="submit" disabled={submitState === "submitting"}>
					{submitState === "submitting" ? "Envoi en cours…" : "Envoyer"}
				</Button>
			</div>
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
