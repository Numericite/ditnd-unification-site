import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = any;

const t = (text: string, format = 0): Node => ({
	mode: "normal",
	text,
	type: "text",
	style: "",
	detail: 0,
	format,
	version: 1,
});

const p = (...children: Node[]): Node => ({
	type: "paragraph",
	format: "",
	indent: 0,
	version: 1,
	children,
	direction: null,
	textStyle: "",
	textFormat: 0,
});

const h2 = (text: string): Node => ({
	tag: "h2",
	type: "heading",
	format: "",
	indent: 0,
	version: 1,
	children: [t(text)],
	direction: null,
});

const li = (value: number, ...children: Node[]): Node => ({
	type: "listitem",
	value,
	format: "",
	indent: 0,
	version: 1,
	checked: true,
	children,
	direction: null,
});

const ul = (...items: Node[]): Node => ({
	tag: "ul",
	type: "list",
	start: 1,
	format: "",
	indent: 0,
	version: 1,
	children: items,
	listType: "bullet",
	direction: null,
});

export const CoursesContent: DefaultTypedEditorState[] = [
	// Course 1 : Comprendre le TSA chez l'enfant (Webinaire)
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			direction: null,
			children: [
				p(
					t(
						"Ce webinaire s'adresse aux parents, aux proches et à toute personne qui souhaite mieux comprendre ce qu'est le trouble du spectre de l'autisme (TSA) chez l'enfant. Il pose les bases essentielles pour mieux saisir les besoins et le fonctionnement particulier de l'enfant autiste.",
					),
				),

				h2("I. Qu'est-ce que le trouble du spectre de l'autisme ?"),

				p(
					t(
						"Le TSA est un trouble du neurodéveloppement présent dès la naissance. Il se caractérise par des différences dans la manière dont le cerveau traite les informations, les interactions sociales et les stimulations sensorielles.",
					),
				),

				p(t("Ce qu'il faut retenir :", 1)),

				ul(
					li(
						1,
						t(
							"Le TSA n'est pas une maladie : c'est un fonctionnement différent du cerveau.",
						),
					),
					li(
						2,
						t(
							"Il touche chaque enfant différemment : on parle de « spectre » car les profils sont très variés.",
						),
					),
					li(
						3,
						t(
							"Le TSA est permanent : il ne disparaît pas, mais l'enfant peut progresser avec un accompagnement adapté.",
						),
					),
					li(
						4,
						t(
							"L'intelligence est préservée dans la grande majorité des cas, même si certains enfants ont également une déficience intellectuelle associée.",
						),
					),
				),

				h2("II. Les principales caractéristiques du TSA"),

				p(
					t(
						"Le TSA se manifeste autour de deux grands axes, selon la classification internationale (DSM-5) :",
					),
				),

				p(t("Axe 1 — Communication et interactions sociales", 1)),

				ul(
					li(1, t("Difficultés à initier ou maintenir une conversation.")),
					li(
						2,
						t(
							"Compréhension littérale du langage (difficulté avec l'implicite, le second degré, l'humour).",
						),
					),
					li(
						3,
						t(
							"Utilisation atypique du regard, des gestes ou des expressions du visage.",
						),
					),
					li(
						4,
						t(
							"Difficulté à comprendre les émotions d'autrui ou à exprimer les siennes.",
						),
					),
				),

				p(t("Axe 2 — Comportements répétitifs et intérêts restreints", 1)),

				ul(
					li(
						1,
						t(
							"Mouvements répétitifs (se balancer, agiter les mains…) — aussi appelés « stims ».",
						),
					),
					li(
						2,
						t(
							"Attachement fort à des routines et grande difficulté face aux changements imprévus.",
						),
					),
					li(
						3,
						t(
							"Intérêts très intenses et focalisés sur un ou quelques sujets précis.",
						),
					),
					li(
						4,
						t(
							"Particularités sensorielles : hypersensibilité ou hyposensibilité aux sons, lumières, textures, odeurs…",
						),
					),
				),

				h2("III. Comment le TSA se manifeste-t-il chez l'enfant ?"),

				p(
					t(
						"Chaque enfant autiste est unique. Les manifestations varient en fonction de l'âge, du niveau de développement et de l'environnement. Quelques exemples courants chez l'enfant :",
					),
				),

				ul(
					li(
						1,
						t(
							"Retard ou absence de langage oral, ou langage très particulier (écholalie, inversion des pronoms).",
						),
					),
					li(
						2,
						t(
							"Peu ou pas de jeu symbolique (« faire semblant ») avant 18 mois.",
						),
					),
					li(
						3,
						t(
							"Difficulté à jouer avec d'autres enfants ou à partager ses intérêts.",
						),
					),
					li(
						4,
						t(
							"Réactions inhabituelles face à certains sons, textures ou changements d'environnement.",
						),
					),
					li(
						5,
						t(
							"Comportements répétitifs ou rituels très rigides dans la vie quotidienne.",
						),
					),
				),

				p(
					t(
						"Ces caractéristiques ne signifient pas que l'enfant ne peut pas progresser. Un accompagnement précoce et adapté fait une réelle différence dans son développement.",
					),
				),

				h2("IV. Que puis-je faire en tant que parent ?"),

				p(
					t(
						"Vous n'êtes pas seul·e. Plusieurs actions concrètes peuvent vous aider à mieux accompagner votre enfant :",
					),
				),

				ul(
					li(
						1,
						t(
							"Chercher un diagnostic : consultez votre médecin traitant ou pédiatre, qui pourra vous orienter vers une équipe spécialisée (CRA, CAMSP, pédopsychiatre).",
						),
					),
					li(
						2,
						t(
							"Vous informer : mieux comprendre le TSA vous permettra d'adapter votre communication et votre environnement.",
						),
					),
					li(
						3,
						t(
							"Rechercher un accompagnement : orthophonie, psychomotricité, ABA, PECS… selon les besoins de votre enfant.",
						),
					),
					li(
						4,
						t(
							"Prendre soin de vous : rejoindre un groupe de parents, solliciter du répit, ne pas s'isoler.",
						),
					),
				),

				p(
					t(
						"Ce webinaire est une première étape. Pour approfondir, n'hésitez pas à consulter les ressources proposées sur ce site et à contacter les professionnels de votre territoire.",
					),
				),
			],
		},
	},

	// Course 2 : Développement et manifestations selon l'âge (Présentiel)
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			direction: null,
			children: [
				p(
					t(
						"Le TSA n'a pas le même visage à 3 ans, à 12 ans ou à 30 ans. Cette formation en présentiel explore comment les manifestations du trouble du spectre de l'autisme évoluent au fil des grandes étapes de la vie, et ce que cela implique pour l'accompagnement.",
					),
				),

				h2("I. La petite enfance (0 – 6 ans)"),

				p(
					t(
						"C'est souvent durant cette période que les premiers signes sont repérés. Le développement de la communication et des interactions sociales est au cœur de cette phase.",
					),
				),

				p(t("Signes fréquemment observés :", 1)),

				ul(
					li(
						1,
						t(
							"Absence ou retard de pointage du doigt pour partager un intérêt (pointage proto-déclaratif).",
						),
					),
					li(2, t("Peu ou pas de jeu « faire semblant » avant 18 mois.")),
					li(
						3,
						t(
							"Réponse atypique à l'appel de son prénom (peut sembler « sourd »).",
						),
					),
					li(
						4,
						t("Retard ou absence de langage verbal, ou langage écholalique."),
					),
					li(
						5,
						t(
							"Attachement fort à des objets inhabituels ou à des routines très rigides.",
						),
					),
				),

				p(
					t(
						"Un diagnostic posé et un accompagnement mis en place tôt (avant 6 ans) permettent des progrès significatifs dans la communication et l'autonomie.",
					),
				),

				h2("II. L'âge scolaire (6 – 12 ans)"),

				p(
					t(
						"L'entrée à l'école marque souvent un tournant. Les exigences sociales augmentent, et les différences de fonctionnement deviennent plus visibles dans le groupe-classe.",
					),
				),

				p(t("Points de vigilance :", 1)),

				ul(
					li(
						1,
						t(
							"Difficultés à comprendre les règles implicites de la vie en groupe.",
						),
					),
					li(
						2,
						t(
							"Fatigue liée à l'effort de « faire comme les autres » (camouflage ou masking).",
						),
					),
					li(
						3,
						t(
							"Hypersensibilité sensorielle exacerbée dans un environnement bruyant et imprévisible.",
						),
					),
					li(
						4,
						t("Risque de harcèlement scolaire lié aux différences sociales."),
					),
				),

				p(t("Leviers d'accompagnement :", 1)),

				ul(
					li(
						1,
						t(
							"Aménagements scolaires (PPS, PAP) : tiers-temps, pictogrammes, cahier de liaison.",
						),
					),
					li(
						2,
						t("Soutien d'un·e AESH pour les activités quotidiennes en classe."),
					),
					li(
						3,
						t(
							"Valorisation des centres d'intérêt de l'enfant pour maintenir sa motivation.",
						),
					),
				),

				h2("III. L'adolescence (12 – 18 ans)"),

				p(
					t(
						"L'adolescence est une période particulièrement éprouvante pour les jeunes autistes. Les changements corporels, les nouvelles attentes sociales et les enjeux d'identité se combinent.",
					),
				),

				ul(
					li(
						1,
						t(
							"Prise de conscience du « décalage » avec les pairs, pouvant générer anxiété et dépression.",
						),
					),
					li(
						2,
						t(
							"Difficultés dans la compréhension des codes amoureux et de l'amitié.",
						),
					),
					li(
						3,
						t(
							"Risque d'épuisement lié au masking et à la pression de conformité sociale.",
						),
					),
					li(4, t("Questionnement sur l'identité et le sens du diagnostic.")),
				),

				p(
					t(
						"C'est aussi une période propice pour renforcer l'autodétermination : aider le jeune à connaître ses droits, à exprimer ses besoins, et à préparer sa transition vers l'âge adulte.",
					),
				),

				h2("IV. L'âge adulte"),

				p(
					t(
						"L'autisme ne disparaît pas à 18 ans. De nombreux adultes autistes, diagnostiqués tardivement ou non, naviguent dans un monde peu adapté à leur fonctionnement.",
					),
				),

				p(t("Enjeux clés à l'âge adulte :", 1)),

				ul(
					li(
						1,
						t(
							"Emploi : trouver un environnement de travail adapté, faire valoir ses droits (RQTH, aménagements de poste).",
						),
					),
					li(
						2,
						t(
							"Autonomie dans la vie quotidienne : logement, gestion administrative, alimentation.",
						),
					),
					li(
						3,
						t(
							"Vie affective et sociale : développer des stratégies pour nouer et maintenir des relations.",
						),
					),
					li(
						4,
						t(
							"Santé mentale : prévenir l'épuisement, l'anxiété chronique et la dépression.",
						),
					),
				),

				p(
					t(
						"Comprendre l'évolution du TSA selon les âges permet de mieux cibler les besoins réels et d'adapter l'accompagnement à chaque étape de vie.",
					),
				),
			],
		},
	},

	// Course 3 : Repérage précoce : signes à observer (MOOC)
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			direction: null,
			children: [
				p(
					t(
						"Ce MOOC propose un parcours de formation pour apprendre à identifier les premiers signes pouvant évoquer un trouble du neurodéveloppement chez l'enfant. L'objectif : permettre un repérage précoce, sans surestimer ni minimiser les signaux observés.",
					),
				),

				h2("I. Pourquoi le repérage précoce est-il essentiel ?"),

				p(
					t(
						"Plus un trouble du neurodéveloppement (TND) est repéré tôt, plus les interventions mises en place sont efficaces. Le cerveau de l'enfant présente une grande plasticité dans les premières années de vie : les apprentissages et les adaptations sont plus faciles à cette période.",
					),
				),

				p(t("Les bénéfices d'un repérage précoce :", 1)),

				ul(
					li(
						1,
						t(
							"Réduction des délais avant la prise en charge (orthophonie, psychomotricité, accompagnement spécialisé).",
						),
					),
					li(
						2,
						t(
							"Meilleure adaptation de l'environnement familial et scolaire dès les premières années.",
						),
					),
					li(
						3,
						t(
							"Diminution de l'anxiété de l'enfant et de la famille liée à une incompréhension prolongée.",
						),
					),
					li(
						4,
						t(
							"Accès plus rapide aux aides (MDPH, accompagnement scolaire, dispositifs médico-sociaux).",
						),
					),
				),

				h2("II. Les signaux d'alerte chez le nourrisson (0 – 12 mois)"),

				p(
					t(
						"Certains signaux, présents dès les premiers mois de vie, peuvent alerter sur un développement atypique. Ils ne constituent pas un diagnostic, mais méritent d'être signalés à un professionnel de santé.",
					),
				),

				p(t("À surveiller :", 1)),

				ul(
					li(
						1,
						t(
							"Absence de sourire social répondant au sourire d'un adulte après 2 mois.",
						),
					),
					li(2, t("Absence de babillage (« gaga », « baba ») après 6 mois.")),
					li(
						3,
						t("Peu ou pas de contact visuel lors des échanges face à face."),
					),
					li(4, t("Absence de réponse à l'appel de son prénom avant 9 mois.")),
					li(
						5,
						t(
							"Hypersensibilité importante aux sons ou aux contacts physiques.",
						),
					),
				),

				p(
					t(
						"Ces signaux isolés ne sont pas alarmants. C'est leur accumulation ou leur persistance qui doit conduire à consulter.",
					),
				),

				h2("III. Les signaux entre 12 et 36 mois"),

				p(
					t(
						"La période 1-3 ans est souvent celle où les parents et les professionnels de santé repèrent le plus clairement des décalages de développement.",
					),
				),

				p(t("Signaux linguistiques :", 1)),

				ul(
					li(
						1,
						t(
							"Absence de mots simples avant 18 mois (hors contexte de plurilinguisme).",
						),
					),
					li(
						2,
						t(
							"Absence d'associations de deux mots (ex. : « encore dodo ») avant 24 mois.",
						),
					),
					li(
						3,
						t(
							"Régression du langage déjà acquis (perte de mots sans cause médicale identifiée).",
						),
					),
				),

				p(t("Signaux comportementaux et sociaux :", 1)),

				ul(
					li(
						1,
						t(
							"Absence de pointage du doigt pour partager un intérêt (pointer un avion, un chien…) avant 18 mois.",
						),
					),
					li(
						2,
						t("Peu d'intérêt pour les autres enfants ou les jeux partagés."),
					),
					li(
						3,
						t("Jeux répétitifs et ritualisés, fort attachement aux routines."),
					),
					li(
						4,
						t(
							"Mouvements répétitifs (se balancer, agiter les mains) dans des contextes de stress ou de plaisir.",
						),
					),
				),

				h2("IV. Que faire si je repère des signes ?"),

				p(
					t(
						"Repérer des signes ne signifie pas poser un diagnostic. Voici les étapes à suivre :",
					),
				),

				ul(
					li(
						1,
						t(
							"En parler au médecin traitant ou au pédiatre lors du prochain bilan de santé.",
						),
					),
					li(
						2,
						t(
							"Utiliser les carnets de santé : les jalons de développement y sont consignés et peuvent vous aider à formuler vos observations.",
						),
					),
					li(
						3,
						t(
							"Demander un bilan auprès d'un CAMSP (Centre d'action médico-sociale précoce) ou d'un CRA (Centre de ressources autisme) si nécessaire.",
						),
					),
					li(
						4,
						t(
							"Ne pas attendre : un simple doute mérite d'être exprimé. Les professionnels de santé sont formés pour accueillir ces questions sans alarmer.",
						),
					),
				),

				p(
					t(
						"Le repérage précoce est l'affaire de tous : parents, assistants maternels, enseignants de maternelle, professionnels de la petite enfance. Ce MOOC vous donne les outils pour agir dès les premiers signes.",
					),
				),
			],
		},
	},
];
