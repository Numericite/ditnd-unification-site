import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

export const PracticalGuidesContent: DefaultTypedEditorState[] = [
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,

			children: [
				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Le fonctionnement sensoriel désigne la manière dont une personne perçoit, traite et interprète les informations provenant de son environnement (sons, lumières, textures, mouvements, odeurs…).",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							type: "linebreak",
							version: 1,
						},

						{
							mode: "normal",
							text: "Chez les personnes autistes, ces perceptions peuvent être plus intenses, plus faibles ou différentes, ce qui influence le confort, l’attention, les émotions ou certains comportements du quotidien.",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					tag: "h2",
					type: "heading",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "I. Qu’est-ce que les particularités sensorielles ?",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},
					],
					direction: null,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les particularités sensorielles sont fréquentes dans l’autisme. Elles peuvent se manifester de différentes façons :",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					tag: "ul",
					type: "list",
					start: 1,
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							type: "listitem",
							value: 1,
							format: "",
							indent: 0,
							checked: true,
							version: 1,
							children: [
								{
									mode: "normal",
									text: "Hypersensibilité : les stimuli du quotidien sont trop forts, dérangeants ou douloureux (un bruit, une lumière vive, un tissu…).",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 2,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "Hyposensibilité : besoin de rechercher davantage de sensations pour sentir ou comprendre ce qui se passe (se balancer, toucher, bouger…).",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 3,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "Recherche sensorielle : besoin de mouvements, de textures ou de stimulations répétitives pour se réguler.",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},
					],
					listType: "bullet",
					direction: null,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Ces particularités ne sont ni un caprice, ni un manque d’éducation : elles ont une origine neurologique.",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					tag: "h2",
					type: "heading",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "II. Comment cela se manifeste au quotidien ?",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},
					],
					direction: null,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les manifestations varient d’une personne à l’autre, mais on peut observer :",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							type: "linebreak",
							version: 1,
						},

						{
							mode: "normal",
							text: "Audition",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					tag: "ul",
					type: "list",
					start: 1,
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							type: "listitem",
							value: 1,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "gêne face aux bruits forts ou imprévisibles",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 2,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "couverture des oreilles",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 3,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "difficulté à filtrer les sons de fond",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},
					],
					listType: "bullet",
					direction: null,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Vision",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					tag: "ul",
					type: "list",
					start: 1,
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							type: "listitem",
							value: 1,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "inconfort face aux lumières vives, néons, reflets",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 2,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "attention portée à des détails plutôt qu’à l’ensemble",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},
					],
					listType: "bullet",
					direction: null,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Toucher",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					tag: "ul",
					type: "list",
					start: 1,
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							type: "listitem",
							value: 1,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "gêne avec certaines textures de vêtements",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 2,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "besoin de toucher des objets et surfaces familières",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},
					],
					listType: "bullet",
					direction: null,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Olfaction et goût",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					tag: "ul",
					type: "list",
					start: 1,
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							type: "listitem",
							value: 1,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "hypersensibilité aux odeurs, sélectivité alimentaire",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 2,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "recherche d’odeurs ou de saveurs très marquées",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},
					],
					listType: "bullet",
					direction: null,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Mouvement (vestibulaire / proprioception)",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					tag: "ul",
					type: "list",
					start: 1,
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							type: "listitem",
							value: 1,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "besoin de bouger, sauter, tourner",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 2,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "difficultés dans la perception du corps dans l’espace",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},
					],
					listType: "bullet",
					direction: null,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Ces comportements ne sont pas « anormaux » : ils sont adaptatifs, car ils aident la personne à se réguler.",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					tag: "h2",
					type: "heading",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "III. Pourquoi est-ce important de comprendre ?",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},
					],
					direction: null,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Comprendre le fonctionnement sensoriel permet :",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					tag: "ul",
					type: "list",
					start: 1,
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							type: "listitem",
							value: 1,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "d’anticiper les situations difficiles (sorties, repas, école…)",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 2,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "d’adapter l’environnement pour réduire l’inconfort",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 3,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "de mieux interpréter les comportements (fuite, agitation, opposition…)",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},

						{
							type: "listitem",
							value: 4,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "de soutenir la personne dans ses besoins, plutôt que de penser à un refus ou un trouble du comportement",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
						},
					],
					listType: "bullet",
					direction: null,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Une bonne compréhension sensorielle améliore souvent la qualité de vie et la communication au sein de la famille.",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},
			],
			direction: null,
		},
	},
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			children: [
				{
					type: "heading",
					tag: "h2",
					format: "",
					indent: 0,
					version: 1,
					children: [
						{
							type: "text",
							text: "Manifestations possibles selon l'âge",
							detail: 0,
							format: 0,
							mode: "normal",
							style: "",
							version: 1,
						},
					],
					direction: null,
				},
			],
			direction: null,
		},
	},
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			children: [
				{
					type: "heading",
					tag: "h2",
					format: "",
					indent: 0,
					version: 1,
					children: [
						{
							type: "text",
							text: "Le lycée constitue une étape cruciale pour l'élève avec un TDAH puisqu'il définit ses goûts et ses aptitudes et commence à tracer son parcours étudiant et professionnel. Quels sont les dispositifs existants pour lui permettre...",
							detail: 0,
							format: 0,
							mode: "normal",
							style: "",
							version: 1,
						},
					],
					direction: null,
				},
			],
			direction: null,
		},
	},
	{
		root: {
			type: "root",
			format: "",
			indent: 0,
			version: 1,
			children: [
				{
					type: "heading",
					tag: "h2",
					format: "",
					indent: 0,
					version: 1,
					children: [
						{
							type: "text",
							text: "Le lycée constitue une étape cruciale pour l'élève avec un TDAH puisqu'il définit ses goûts et ses aptitudes et commence à tracer son parcours étudiant et professionnel. Quels sont les dispositifs existants pour lui permettre...",
							detail: 0,
							format: 0,
							mode: "normal",
							style: "",
							version: 1,
						},
					],
					direction: null,
				},
			],
			direction: null,
		},
	},
];
