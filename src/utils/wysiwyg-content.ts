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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Vous aidez régulièrement un enfant ou un adulte en situation de handicap, en perte d’autonomie ou atteint de maladie grave, et vous vous sentez fatigué ou isolé ? Cette fiche présente les solutions de soutien et de répit existantes pour vous permettre de souffler et préserver votre équilibre.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Voici les informations que vous trouverez sur cette page :",
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
									text: "Identifier une solution de répit adaptée",
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
									text: "Consulter les recommandations officielles",
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
									text: "Trouver une plateforme de répit",
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
									text: "Connaître les aides financières",
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
							value: 5,
							format: "",
							indent: 0,
							version: 1,
							checked: true,
							children: [
								{
									mode: "normal",
									text: "Comprendre le congé de proche aidant",
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
							value: 6,
							format: "",
							indent: 0,
							version: 1,
							checked: true,
							children: [
								{
									mode: "normal",
									text: "Ressources complémentaires",
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
					tag: "h2",
					type: "heading",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "I. Quelles sont les solutions de répit pour les aidants ?",
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
							text: "Il existe des solutions de répit :",
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
									text: "permettant de bénéficier d’un relais ou d’un soutien à l’extérieur du domicile ;",
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
									text: "permettant d’organiser un relais et un accompagnement au domicile de la personne aidée ;",
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
									text: "proposant à l’aidant et à son proche de partager des moments privilégiés en dehors du quotidien, notamment pendant des vacances ou des séjours de répit.",
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
							text: "On peut citer notamment :",
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
									text: "des places d’accueil de jour ou de nuit ;",
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
									text: "un hébergement temporaire ;",
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
									text: "un hébergement en famille d’accueil ou en maison de répit ;",
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
									text: "un relais à la maison (baluchonnage, répit à domicile, aide la nuit…) ;",
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
							value: 5,
							format: "",
							indent: 0,
							version: 1,
							checked: true,
							children: [
								{
									mode: "normal",
									text: "des séjours de répit pendant les vacances.",
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
							text: "Pour en savoir plus sur les dispositifs existants :",
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
									id: "697375a231c5785d729921fe",
									type: "link",

									fields: {
										url: "https://www.monparcourshandicap.gouv.fr/glossaire/mon-parcours-handicap",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "le site Mon Parcours Handicap",
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
									mode: "normal",
									text: " (aménagements prévus au titre du droit au répit) ;",
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
									text: "le ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697375a231c5785d729921ff",
									type: "link",

									fields: {
										url: "https://solidarites.gouv.fr/aidant#anchor-navigation-912",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "site du ministère des Solidarités",
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
									mode: "normal",
									text: " – page « Des solutions pour soutenir le quotidien des aidants » ;",
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
									text: "le site ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697375a231c5785d72992200",
									type: "link",

									fields: {
										url: "https://maboussoleaidants.fr/mon-parcours/trouver-soutien",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Ma boussole aidants",
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
									mode: "normal",
									text: ".",
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
							text: "Ces solutions peuvent vous aider à organiser des temps de pause tout en assurant la continuité de l’accompagnement de votre proche.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [],
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
							text: "II. Les recommandations de bonnes pratiques professionnelles à l’égard des aidants",
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
							text: "La Haute Autorité de santé (HAS) met à disposition des recommandations pour mieux repérer et évaluer les situations d’aidance et mettre en place des solutions adaptées. Elles s’adressent notamment aux professionnels du sanitaire, du social, du médico-social, de l’éducation nationale et du monde du travail.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Pour aller plus loin :",
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
									id: "697375a231c5785d72992201",
									type: "link",

									fields: {
										url: "https://youtu.be/0-n-RliYEX4",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "replay du webinaire organisé par la HAS",
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
									mode: "normal",
									text: " ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									mode: "normal",
									text: "[vidéo embarquée]",
									type: "text",
									style: "",
									detail: 0,
									format: 2,
									version: 1,
								},

								{
									mode: "normal",
									text: ";",
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
									id: "697375a231c5785d72992202",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/rbpp_repit_aidants-recommandations.pdf",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "RBPP répit aidants",
											type: "text",
											style: "",
											detail: 0,
											format: 1,
											version: 1,
										},
									],
									direction: null,
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
									id: "697375a231c5785d72992203",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/repit_des_aidants_points_cle_vdef.pdf",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Synthèse des RBPP",
											type: "text",
											style: "",
											detail: 0,
											format: 1,
											version: 1,
										},
									],
									direction: null,
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
									id: "697375a231c5785d72992204",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/repit_des_aidants_grille_evaluation_vdef_2024-06-25_11-17-1_775.pdf",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Grille de repérage",
											type: "text",
											style: "",
											detail: 0,
											format: 1,
											version: 1,
										},
									],
									direction: null,
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
							text: "Ces outils facilitent une meilleure prise en compte de votre situation par les professionnels.",
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
							text: "III. Les plateformes de répit de proches aidants (PFR)",
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
							text: "Les ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "697375a231c5785d72992205",
							type: "link",

							fields: {
								url: "https://maboussoleaidants.fr/ma-vie-daidant/devenir-aidant/interlocuteurs-cles/qu-est-ce-qu-une-plateforme-de-repit-pour-les-aidants-PFR",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "plateformes de répit de proches aidants",
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
							mode: "normal",
							text: " (PFR ou PARA) accompagnent les aidants auprès d’un proche en situation de handicap ou de dépendance.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Leur mission : proposer de l’écoute, des conseils, des solutions de répit et du soutien, afin de prévenir l’épuisement.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Le répit peut prendre plusieurs formes : prise en charge temporaire du proche, accueil de jour, accompagnement ponctuel, groupes de parole, activités pour l’aidant, etc.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Elles vous aident à trouver un meilleur équilibre entre votre rôle d’aidant et votre vie personnelle.",
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
							text: "IV. Comment financer une solution de répit ?",
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
							text: "Pour financer une solution de répit, vous pouvez demander :",
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
									text: "un congé de proche aidant ; ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697375a231c5785d72992206",
									type: "link",

									fields: {
										url: "https://www.monparcourshandicap.gouv.fr/aidant/le-conge-de-proche-aidant",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "https://www.monparcourshandicap.gouv.fr/aidant/le-conge-de-proche-aidant",
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
									text: "l’allocation journalière du proche aidant (AJPA) ;",
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
									text: "l’allocation d’éducation de l’enfant handicapé (AEEH) ou la prestation de compensation du handicap (PCH) ; ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697375a231c5785d72992207",
									type: "link",

									fields: {
										url: "https://www.monparcourshandicap.gouv.fr/aides/lallocation-deducation-de-lenfant-handicape-aeeh",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "https://www.monparcourshandicap.gouv.fr/aides/lallocation-deducation-de-lenfant-handicape-aeeh",
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
									text: "l’allocation personnalisée d’autonomie (APA), avec aide au répit possible ; ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697375a231c5785d72992208",
									type: "link",

									fields: {
										url: "https://www.monparcourshandicap.gouv.fr/aides/lallocation-personnalisee-dautonomie-apa",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "https://www.monparcourshandicap.gouv.fr/aides/lallocation-personnalisee-dautonomie-apa",
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
							direction: null,
						},

						{
							type: "listitem",
							value: 5,
							format: "",
							indent: 0,
							version: 1,
							checked: true,
							children: [
								{
									mode: "normal",
									text: "une aide exceptionnelle via le CCAS ou CIAS ;",
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
							value: 6,
							format: "",
							indent: 0,
							version: 1,
							checked: true,
							children: [
								{
									mode: "normal",
									text: "une participation financière du département, de la caisse de retraite ou de la mutuelle.",
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
							text: "Bon à savoir : si vous utilisez un service à domicile, vous pouvez bénéficier d’un crédit d’impôt de 50 %, avec avance immédiate possible. ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "697375a231c5785d72992209",
							type: "link",

							fields: {
								url: "https://www.monparcourshandicap.gouv.fr/actualite/services-la-personne-avance-immediate-du-credit-dimpot",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "https://www.monparcourshandicap.gouv.fr/actualite/services-la-personne-avance-immediate-du-credit-dimpot",
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
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Ces aides peuvent réduire le coût des solutions de répit.",
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
							text: "V. Le congé de proche aidant",
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
							text: "Le congé de proche aidant permet à un salarié de réduire ou suspendre temporairement son activité professionnelle pour accompagner un proche.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Qui",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},

						{
							mode: "normal",
							text: " peut le demander : tout salarié du secteur privé ou public, sans condition d’ancienneté.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Durée",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},

						{
							mode: "normal",
							text: " : jusqu’à 3 mois en cumulé, renouvelable dans la limite d’un an sur l’ensemble de la carrière.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Rémunération",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},

						{
							mode: "normal",
							text: " : le congé n’est pas rémunéré par l’employeur, mais une ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "697375a231c5785d7299220a",
							type: "link",

							fields: {
								url: "https://www.service-public.fr/particuliers/vosdroits/R57305",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "AJPA",
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
							mode: "normal",
							text: " peut être versée sous conditions.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Démarches",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},

						{
							mode: "normal",
							text: " :",
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
									text: "Pour obtenir le congé, il faut :",
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
									text: "déposer une ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									mode: "normal",
									text: "demande auprès de l’employeur",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: "(le refus n’est pas autorisé si les conditions sont remplies) ;",
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
									text: "le faire ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									mode: "normal",
									text: "au moins un mois avant",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: "la date envisagée (sauf cas d’urgence) ;",
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
									text: "fournir des ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									mode: "normal",
									text: "documents justificatifs",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: ": lien de parenté ou attestation d’aide régulière, le cas échéant le document relatif au handicap de la personne aidée (taux d’incapacité, décision MDPH, attribution de prestation d’autonomie…) ;",
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
							value: 5,
							format: "",
							indent: 0,
							version: 1,
							checked: true,
							children: [
								{
									mode: "normal",
									text: "dans des cas d’",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									mode: "normal",
									text: "urgence",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: "(détérioration soudaine de l’état de santé, crise ou situation de rupture), le congé peut être demandé sans délai, sur justificatif médical ou attestation de l’établissement.",
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
							text: "Pour en savoir plus sur le congé de proche aidant :",
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
									text: "la page dédiée sur le site ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697375a231c5785d7299220b",
									type: "link",

									fields: {
										url: "https://www.monparcourshandicap.gouv.fr/aidant/le-conge-de-proche-aidant",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Mon parcours handicap,",
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
									text: "la fiche pratique sur le site ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697375a231c5785d7299220c",
									type: "link",

									fields: {
										url: "https://www.service-public.fr/particuliers/vosdroits/F16920",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Service-public",
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
									text: "notre ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697375a231c5785d7299220d",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/Fiche-pratique-Conge-de-proche-aidant-1.pdf",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "fiche pratique dédiée à télécharger",
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
							text: "Ce dispositif permet de dégager du temps pour accompagner votre proche sans perdre totalement vos droits sociaux.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "À retenir",
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
									text: "Être proche aidant peut s’avérer éprouvant : des solutions de répit existent pour souffler.",
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
									text: "Vous pouvez accéder à des aménagements prévus au titre du droit au répit pour les aidants familiaux.",
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
									text: "Les plateformes de répit accompagnent les aidants pour prévenir l’épuisement.",
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
									text: "Les informations actualisées sont disponibles sur Mon Parcours Handicap et ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697375a231c5785d7299220e",
									type: "link",

									fields: {
										url: "http://xn--Solidarit-j4a.gouv.fr",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Solidarité.gouv.fr",
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
									mode: "normal",
									text: ". </aside>",
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
			],
			direction: null,
			textFormat: 1,
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Vous êtes proche aidant d’une personne autiste et vous souhaitez mieux comprendre l’autisme ? Cette page présente les possibilités de formation pour acquérir des repères, développer des compétences et faciliter l’accompagnement au quotidien.",
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
							text: "Pourquoi se former quand on est proche aidant ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Se former permet de mieux comprendre les particularités de l’autisme et d’adapter son accompagnement aux besoins de la personne concernée.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "La formation contribue aussi à réduire l’isolement et à renforcer le pouvoir d’agir des aidants.",
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
							text: "Quels types de formations existent ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Il existe différents types de formations pour les proches aidants :",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Formations généralistes pour les aidants",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Ces formations abordent le rôle d’aidant, les droits, la prévention de l’épuisement et les ressources existantes.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Formations spécifiques au trouble du spectre de l’autisme (TSA)",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les formations spécifiques à l’autisme portent sur la compréhension du TSA, la communication, les comportements et l’accompagnement au quotidien.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Vous pouvez suivre ces formations en présentiel ou à distance, en fonction de l’organisme qui les délivre.",
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
							text: "Qui propose ces formations et comment en bénéficier ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Les formations peuvent être proposées par des associations, des organismes de formation, des centres de ressources autisme (CRA) ou dans le cadre de dispositifs nationaux ou régionaux.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les modalités d’accès varient selon les dispositifs. Certaines formations sont gratuites, d’autres peuvent être financées dans le cadre de dispositifs dédiés aux aidants.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les plateformes de répit et les points d’information locaux peuvent orienter les aidants vers des formations adaptées.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Voici quelques pistes pour trouver la formation qui vous sera utile dans votre rôle de proche aidant de personne autiste.",
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
									text: "Le site « ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921dc",
									type: "link",

									fields: {
										url: "https://www.soutenirlesaidants.fr/recherche/formations",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Soutenir les aidants",
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
									mode: "normal",
									text: "» : formation en ligne « ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921dd",
									type: "link",

									fields: {
										url: "https://www.soutenirlesaidants.fr/formations/accompagner-une-personne-avec-troubles-du-spectre-autistique?goBack=search",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Accompagner une personne autiste",
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
									mode: "normal",
									text: " »",
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
									text: "CeAND : formation « ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921de",
									type: "link",

									fields: {
										url: "https://www.ceand.org/ecole-des-tnd/#formations-aidant",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "L’école des TND",
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
									mode: "normal",
									text: "»",
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
									text: "Le GNCRA (Groupement National des Centres de Ressource Autisme) recense dans un catalogue dédié ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921df",
									type: "link",

									fields: {
										url: "https://gncra.fr/formation/catalogue-des-formations-tsa/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "les formations dans le champ des TSA",
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
									mode: "normal",
									text: ", notamment à destination des proches aidants",
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
									text: "Mon Parcours Handicap : ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921e0",
									type: "link",

									fields: {
										url: "https://www.monparcourshandicap.gouv.fr/aidant/des-formations-gratuites-pour-les-aidants",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "formations gratuites pour les aidants",
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
									mode: "normal",
									text: "et en particulier un ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921e1",
									type: "link",

									fields: {
										url: "https://www.monparcourshandicap.gouv.fr/annuaire",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "annuaire des formations",
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
									mode: "normal",
									text: " par thématique et lieu",
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
							value: 5,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "Le site « ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921e2",
									type: "link",

									fields: {
										url: "https://www.soutenirlesaidants.fr/recherche/formations",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Soutenir les aidants",
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
									mode: "normal",
									text: "» propose des formations en ligne",
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
							value: 6,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									id: "697374dc31c5785d729921e3",
									type: "link",

									fields: {
										url: "https://www.soutenirlesaidants.fr/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "La carte sur le site de la fédération des plateformes de répit appelée « Soutenir les aidants »",
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
									mode: "normal",
									text: " (en bas de la page d’accueil).",
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
							value: 7,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "La « ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921e4",
									type: "link",

									fields: {
										url: "https://lacompagniedesaidants.org/parcours/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Compagnie des aidants",
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
									mode: "normal",
									text: " » : formations gratuites pour les aidants.",
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
							value: 8,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									id: "697374dc31c5785d729921e5",
									type: "link",

									fields: {
										url: "https://formation.aidants.fr/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Association française des aidants (financée par la CNSA)",
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
									mode: "normal",
									text: ": 6 modules de 30 mn",
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
							value: 9,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "TDAH France – ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921e6",
									type: "link",

									fields: {
										url: "https://www.tdah-france.fr/Formation.html",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "formations sur le TDAH",
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
							direction: null,
						},
					],
					listType: "bullet",
					direction: null,
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
							text: "Combien coûte une formation pour les aidants ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Les formations dédiées à la compréhension et l’accompagnement de votre proche autiste n’engendrent en général pas de de coût de votre part. Certaines sont même gratuites.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Pour les formations professionnalisantes, vous pouvez mobiliser des aides financières, comme par exemple :",
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
									text: "Compte Personnel de Formation (CPF) si vous êtes salarié.",
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
									text: "Prise en charge par associations ou collectivités.",
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
									text: "Fonds dédiés en entreprise pour aidants salariés.",
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
							text: "Renseignez-vous directement auprès de ces organismes.",
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
							text: "Le dispositif FPA (formation des proches aidants)",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Le ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "697374dc31c5785d729921e7",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/accueil/gncra/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "GNCRA",
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
							mode: "normal",
							text: " a développé le dispositif « Formation des proches aidants » (FPA). Retrouvez le centre de ressources autisme (CRA) le plus proche de chez vous et proposant ces formations ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "697374dc31c5785d729921e8",
							type: "link",

							fields: {
								url: "https://gncra.fr/les-fiches-des-cra/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "en cliquant ici",
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
							mode: "normal",
							text: ".",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Que pouvez-vous apprendre en formation de proche aidant?",
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
									text: "Les démarches administratives : remplir des formulaires, faire des demandes d’aide…",
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
									text: "Les actes de la vie quotidienne : présence active pour tous les actes de la vie quotidienne (s’habiller, se laver, manger, se déplacer…), aménagements sensoriels et temporels de l’environnement…",
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
									text: "La communication : aider à communiquer avec les autres…",
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
									text: "L’éducation et la vie sociale : accompagner à l’école, aux activités extrascolaires, aux rendez-vous médicaux, soutenir la participation sociale…",
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
							value: 5,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "Le soutien psychologique : être à l’écoute, offrir un soutien moral…",
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

					children: [],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Pour en savoir plus sur le dispositif Formation des proches aidants (FPA) déployé par le GNCRA, consultez :",
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
									text: "la plateforme de formation « ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921ed",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/accueil-se-former-tnd/campus-gncra/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Campus du GNCRA",
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
									mode: "normal",
									text: "»",
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
									text: "cette vidéo de présentation : ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697374dc31c5785d729921ee",
									type: "link",

									fields: {
										url: "https://youtu.be/pi2dJLk6X1Y",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "https://youtu.be/pi2dJLk6X1Y",
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
							direction: null,
						},
					],
					listType: "bullet",
					direction: null,
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
							text: "À retenir",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "En tant que proche aidant, vous avez un droit à la formation. Ce dernier vous permet de mieux accompagner votre proche et préserver votre équilibre.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Vous pouvez vous former via le GNCRA, les CRA, le site « Soutenir les aidants », « Mon Parcours Handicap », ou encore des associations spécialisées.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "La plupart des formations spécifiques aux aidants sont gratuites. Pour les formations professionnalisantes, il existe des financements (CPF, aides associatives ou collectivités).",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Être proche aidant d’une personne autiste (enfant ou adulte) peut être exigeant. Cette page vous aide à comprendre votre rôle, à repérer les étapes clés du parcours et à identifier les ressources utiles (droits, formation, soutien et répit).",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Si vous avez besoin d’orientation, commencez par la section « Démarches et contacts utiles ».",
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
							text: "Qu’est-ce qu’un proche aidant ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Selon le ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973747131c5785d729921b2",
							type: "link",

							fields: {
								url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018782122",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Code de l’action sociale et des familles",
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
							mode: "normal",
							text: ", un proche aidant est une personne qui aide, de façon régulière et non professionnelle, une personne en situation de handicap pour les actes de la vie quotidienne.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Aujourd’hui, 1 Français sur 5 est aidant et s’occupe d’un proche en perte d’autonomie, malade ou en situation de handicap.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "La Haute Autorité de Santé précise que « cette aide régulière peut être prodiguée de façon permanente ou non et peut prendre plusieurs formes ». (HAS, ",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},

						{
							id: "6973747131c5785d729921b3",
							type: "link",

							fields: {
								url: "https://www.has-sante.fr/upload/docs/application/pdf/2018-03/anesm-synthese-soutien_aidants-vdef.pdf",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Synthèse de recommandations de bonnes pratiques",
									type: "text",
									style: "",
									detail: 0,
									format: 3,
									version: 1,
								},
							],
							direction: null,
						},

						{
							mode: "normal",
							text: ").",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Exemples de proches aidants :",
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
									text: "famille (parent, conjoint, frère/sœur, oncle/tante, neveu/nièce, etc.)",
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
									text: "amis",
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
									text: "entourage (voisin, gardien d’immeuble, etc.)",
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

					children: [],
					direction: null,
					textStyle: "",
					textFormat: 1,
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
							text: "Quelles sont les grandes étapes pour accompagner votre proche autiste ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Étape 1 – Lever le doute sur un éventuel écart de développement",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Si vous observez des différences dans le langage, la communication ou le comportement, demandez conseil à un professionnel de santé. Un repérage précoce permet d’agir plus tôt.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Pour en savoir plus sur le repérage précoce, consultez les fiches suivantes :",
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
									id: "6973747131c5785d729921b6",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/strategie-nationale-tnd/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Que sont les troubles du neurodéveloppement (TND)",
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
									mode: "normal",
									text: "?",
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
									id: "6973747131c5785d729921b7",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/reperage-precoce-tnd-enfant/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Repérage précoce des troubles du neurodéveloppement chez l’enfant",
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
									id: "6973747131c5785d729921b8",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/carnet-de-sante-reperage-tnd/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Le nouveau carnet de santé avec repérage des écarts de développement",
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
									id: "6973747131c5785d729921b9",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/evenements-maison-de-l-autisme/reperage-precoce-des-ecarts-de-developpement/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Campagne « Agir tôt » pour le repérage précoce",
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

					children: [],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973747131c5785d729921bc",
							type: "link",

							fields: {
								url: "https://agir-tot.fr/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Campagne de repérage",
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
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Étape 2 – Démarrer un diagnostic",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Seul un médecin, avec l’appui de bilans réalisés par des professionnels médicaux et paramédicaux, peut poser un diagnostic de ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973747131c5785d729921bd",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/strategie-nationale-tnd/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "trouble du neurodéveloppement",
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
							mode: "normal",
							text: " (TND), dont le ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973747131c5785d729921be",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/qu-est-ce-que-l-autisme/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "trouble du spectre de l’autisme",
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
							mode: "normal",
							text: " (TSA).",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Ces fiches pratiques vous aident à comprendre le parcours de diagnostic :",
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
									id: "6973747131c5785d729921bf",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/parcours-diagnostic-autisme/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Etapes du parcours de diagnostic d’autisme",
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
									mode: "normal",
									text: ".",
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
									id: "6973747131c5785d729921c0",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/guide-parcours-diagnostic-autisme/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Guide des parcours de diagnostic d’autisme",
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
									mode: "normal",
									text: " en fonction de la situation de la personne concernée par la démarche de diagnostic.",
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
							text: "Étape 3 – Solliciter la Maison départementales des personnes handicapées (MDPH)",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Après le diagnostic, la MDPH évalue les besoins d’aide, de compensation et d’adaptation. Elle peut ouvrir des droits en fonction des situations (aides, allocations, aménagements).",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Pour en savoir plus sur la MDPH, consultez ces ressources :",
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
									id: "6973747131c5785d729921c1",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/dossier-mdph-autisme/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Dossier MDPH en cas d’autisme",
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
									id: "6973747131c5785d729921c2",
									type: "link",

									fields: {
										url: "https://www.notion.so/numericite/youtube.com/watch?feature=shared&v=eXLEZS9cDr8",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Replay du webinaire « droits et démarches (enfants et adultes autistes) »",
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
							text: "Étape 4 – Accompagner votre proche tout au long de sa vie",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Scolarité, études, emploi, santé, logement, loisirs, vie sociale : l’accompagnement de votre proche autiste évolue avec ses besoins. Les fiches pratiques de la Maison de l’autisme couvrent ces sujets.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Voir toutes les fiches pratiques : ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973747131c5785d729921c3",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/",
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
							text: "Quels sont mes droits en tant que proche aidant de personne autiste ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},
					],
					direction: null,
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Le statut d’aidant familial est défini par la loi. Il ouvre à des aides spécifiques pour accompagner votre proche et également pour vous protéger.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Pour connaître vos droits en tant que proche aidant, consultez la fiche ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973747131c5785d729921c4",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/droits-aidants-autisme/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Droits des aidants dans l’autisme",
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
							mode: "normal",
							text: ".",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					tag: "h3",
					type: "heading",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Comment me former en tant que proche aidant de personne autiste ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Vous pouvez vous former pour mieux comprendre l’autisme et adapter votre accompagnement.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Pour connaître vos possibilités de formation et leur condition de prise en charge, consultez la fiche ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973747131c5785d729921c7",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/se-former-proche-aidant-autisme/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Se former quand on est aidant",
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
							mode: "normal",
							text: ".",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					tag: "h3",
					type: "heading",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Où trouver du soutien et du répit en tant que proche aidant de personne autiste ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Il existe des solutions de soutien et de répit pour vous permettre de souffler.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Pour connaître ces solutions, consultez la fiche ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973747131c5785d729921ca",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/soutien-repit-proches-aidants-autisme/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Soutien et répit des proches aidants",
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
							mode: "normal",
							text: ".",
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
			textFormat: 1,
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Votre enfant présente un écart de développement ou un professionnel vous a parlé d’une PCO ? Cette fiche explique à quoi servent les plateformes de coordination et d’orientation, à qui elles s’adressent et comment elles facilitent l’accès aux interventions précoces.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Vous avez un doute concernant le développement de votre enfant ? Parlez-en à votre médecin pour envisager une orientation vers une PCO.",
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
							text: "Qu’est-ce qu’une plateforme de coordination et d’orientation ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Les plateformes de coordination et d’orientation (PCO) sont des dispositifs publics. Elles servent à organiser le parcours des enfants qui présentent un écart de développement.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Elles permettent aux enfants d’accéder plus rapidement à des bilans et à des interventions précoces, sans attendre qu’un diagnostic soit posé.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les PCO occupent une place centrale dans la Stratégie nationale 2023-2027 pour les troubles du neurodéveloppement. Cette stratégie a pour objectif de repérer plus tôt les écarts de développement, de proposer un accompagnement précoce et de soutenir les familles dès les premières inquiétudes.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Elle vise également à rendre les parcours plus souples, à réduire les délais de prise en charge et à améliorer la coordination entre les secteurs médical, social, éducatif et médico-social.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Ainsi, les PCO traduisent la volonté nationale de garantir un accès équitable aux dispositifs et un accompagnement cohérent pour les jeunes enfants concernés par un trouble du neurodéveloppement.",
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
							text: "À qui s’adressent les plateformes de coordination et d’orientation ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Les PCO s’adressent aux enfants :",
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
									text: "âgés de 0 à 12 ans",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: ",",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
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
									text: "pour lesquels l’entourage et/ou le médecin constate un ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									mode: "normal",
									text: "écart inhabituel de développement",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " (langage, motricité, interactions sociales, attention, comportement ou sensorialité),",
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
									text: "n’ayant pas déjà un diagnostic d’un trouble du neurodéveloppement posé",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " et ne bénéficiant pas déjà d’une aide de la MDPH pour financer dess soins.",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
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
							text: "Les repérages faits par les familles, les professionnels de la petite enfance, les enseignants et les médecins sont essentiels.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Un retard ou une différence observée ne signifie pas forcément qu’il s’agit d’un trouble du neurodéveloppement. En revanche, ces signes justifient toujours de demander un avis médical.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Quel est le rôle des plateformes de coordination et d’orientation ?",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les PCO coordonnent les interventions entre les professionnels de santé, les professionnels paramédicaux et les acteurs médico-sociaux.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Elles organisent les évaluations nécessaires et proposent un plan d’interventions précoces adapté aux besoins de l’enfant.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Comment accéder à une PCO ?",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "L’accès à une PCO se fait obligatoirement sur orientation d’un médecin, qui écoute les observations des parents et examine l’enfant.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les parents ne peuvent pas saisir directement une PCO sans prescription médicale.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Vous pouvez vous adresser au médecin qui suit habituellement votre enfant, mais tout médecin (pédiatre, médecin scolaire, de PMI, de CRA…) peut adresser vers la PCO.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Le rôle de votre médecin généraliste ou pédiatre est de :",
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
									text: "repérer",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " les signes d’écart de développement (communication, motricité fine et globale, interactions sociales, attention, comportement, sensorialité…),",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
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
									text: "contacter",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " la plateforme avec l’accord de la famille,",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
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
									text: "coordonner",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " le parcours avec les professionnels de la plateforme,",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
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
									text: "et ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									mode: "normal",
									text: "annoncer",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " le diagnostic.",
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
							text: "Le médecin scolaire ou le médecin de la PMI peut également vous orienter et adresser votre enfant à la plateforme à l’aide du livret de repérage. ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							mode: "normal",
							text: "à Vous pouvez télécharger le livret de repérage correspondant à l’âge de votre enfant en bas de page.",
							type: "text",
							style: "",
							detail: 0,
							format: 2,
							version: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Lorsque plusieurs signes font penser qu’un trouble du neurodéveloppement est possible, le médecin oriente l’enfant vers la PCO du département de résidence, à l’aide d’un formulaire dédié. Il n’est pas nécessaire d’attendre un diagnostic ni d’en être certain. La simple suspicion suffit, car l’objectif est d’éviter toute perte de temps pendant une période importante du développement.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Cependant, tous les médecins ne connaissent pas toujours l’existence des PCO. Si vous connaissez ce dispositif, il est donc important, en tant que parent, d’informer et de sensibiliser les professionnels en contact avec votre enfant. Si besoin, vous pouvez leur présenter ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "697373ce31c5785d729921a6",
							type: "link",

							fields: {
								url: "https://handicap-v2.cegedim.cloud/sites/handicap/files/files-spip/pdf/brochure_reperage_tnd_2020.janv.pdf",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "ce guide aidant au repérage des troubles du développement chez les enfants et d’adressage vers une PCO",
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
							mode: "normal",
							text: ".",
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
							text: "A savoir : qu’est-ce qu’une consultation longue majorée ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},
					],
					direction: null,
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Lorsqu’ils observent des signes d’alerte d’un écart de développement, les médecins traitants et les pédiatres peuvent proposer, depuis le 11 février 2019, une consultation de dépistage appelée consultation longue majorée. Cette consultation est facturée 60 € et fait l’objet d’un remboursement. Dans les départements et régions d’outre-mer (DROM), le tarif est de 72 €.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Lorsque le médecin suspecte un trouble du neurodéveloppement, cette consultation permet d’établir un premier repérage. Le médecin peut ensuite orienter l’enfant vers une PCO afin de confirmer le diagnostic et de proposer un accompagnement adapté.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les familles peuvent également s’appuyer sur la campagne « ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "697373ce31c5785d729921a7",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/evenements-maison-de-l-autisme/reperage-precoce-des-ecarts-de-developpement/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Handicap Agir Tôt",
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
							mode: "normal",
							text: " ». Cette campagne fournit des repères simples pour identifier les premiers signes et incite à demander un avis médical.",
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
							text: "Comment se passe le parcours dans une PCO ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Les plateformes de coordination et d’orientation (PCO) s’adressent à tous les enfants qui peuvent présenter un trouble du neurodéveloppement. Elles constituent souvent la première étape d’un parcours plus large. Selon les besoins de l’enfant, ce parcours peut ensuite inclure :",
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
									text: "des bilans diagnostiques plus approfondis,",
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
									text: "des interventions éducatives, médico-sociales ou de santé,",
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
									text: "ainsi qu’un accompagnement vers la scolarisation ou l’accès aux droits.",
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
							text: "Le parcours commence par une orientation médicale. Le plus souvent, le médecin traitant, le pédiatre ou un médecin de protection maternelle et infantile (PMI) oriente l’enfant vers la PCO.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "La plateforme de coordination et d’orientation organise ensuite les bilans et coordonne les interventions précoces, en lien étroit avec la famille.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les étapes du parcours",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Le parcours se déroule en plusieurs étapes :",
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
					tag: "ol",
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
									text: "Lors de la consultation médicale, le médecin repère des signes d’alerte du développement.",
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
									text: "À la suite de ce repérage, le médecin oriente l’enfant vers la PCO. Cette orientation permet de proposer un parcours de soins sécurisé et fluide, tout en garantissant une prise en charge financière. Le médecin complète une grille de repérage et un formulaire d’adressage, puis les transmet à la plateforme et à la famille.",
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
									text: "Le médecin coordinateur de la PCO examine la demande. Il valide l’entrée dans le dispositif et propose un parcours adapté aux besoins de l’enfant, en tenant compte des observations cliniques du médecin.",
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
					listType: "number",
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
							text: "Mise en œuvre du parcours de soins et des interventions",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "La plateforme de coordination et d’orientation prend en charge l’organisation des rendez-vous. Elle peut orienter l’enfant :",
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
									text: "vers des structures sanitaires ou médico-sociales compétentes,",
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
									text: "ou vers des professionnels libéraux, conventionnés ou non, qui travaillent en lien avec la plateforme.",
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
							text: "Les bilans et les interventions se mettent ainsi en place le plus rapidement possible, et au plus près du domicile de l’enfant.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Lorsqu’un enfant entre dans une PCO, une équipe dédiée analyse la demande, valide l’entrée dans le dispositif et construit avec la famille un parcours personnalisé d’évaluations et d’interventions.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Quels professionnels interviennent autour de l’enfant ?",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Autour de l’enfant et de sa famille, la PCO mobilise plusieurs professionnels aux compétences complémentaires, afin d’agir sans attendre. Selon les besoins, ce parcours peut associer :",
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
									text: "un ou plusieurs médecins (médecin généraliste, pédiatre, neurologue, pédopsychiatre),",
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
									text: "des psychologues ou des neuropsychologues,",
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
									text: "des orthophonistes,",
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
									text: "des psychomotriciens,",
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
							value: 5,
							format: "",
							indent: 0,
							version: 1,
							checked: true,

							children: [
								{
									mode: "normal",
									text: "des ergothérapeutes.",
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
							text: "Qui réalise les bilans et comment la PCO vous accompagne ?",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Des structures spécialisées, comme les CAMSP, les CMPP ou les CMP, réalisent les bilans nécessaires. Elles travaillent en lien avec différents professionnels, comme les orthophonistes, les psychologues ou les psychomotriciens. à ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							mode: "normal",
							text: "Vous trouverez la définition de ces sigles en bas de page",
							type: "text",
							style: "",
							detail: 0,
							format: 2,
							version: 1,
						},

						{
							mode: "normal",
							text: ".",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "La PCO accompagne également les familles dans leurs démarches auprès de la Maison départementale des personnes handicapées (MDPH), de l’école ou d’autres administrations.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Après la validation du dossier, la PCO organise les rendez-vous avec les spécialistes concernés. Les bilans et les interventions doivent alors se mettre en place dans un délai maximum de trois mois, et au plus près du domicile de l’enfant.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Selon les besoins de l’enfant, la PCO peut aussi faire appel à des éducateurs spécialisés, à des professionnels de la petite enfance ou à l’école, afin d’assurer un accompagnement adapté.",
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
							text: "Quelle est la durée de prise en charge dans une plateforme de coordination et d’orientation ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "La PCO assure la prise en charge pendant une durée de 12 mois. Elle peut renouveler cette prise en charge pour une seconde période de 12 mois, soit un total de deux ans.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "L’objectif est de mettre en place les soins nécessaires. Ensuite, selon la situation et les besoins de l’enfant, d’autres structures spécialisées peuvent prendre le relais, comme les CAMSP, les CMPP, les CMP ou les SESSAD.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Où trouver une PCO ?",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Il existe aujourd’hui en France 110 plateformes 0-6 ans et 48 plateformes 7-12 ans.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Elles sont sectorisées, par département ou par zone de département.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Le médecin vous adressera à une PCO en fonction du lieu où vous vivez avec votre enfant.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "697373ce31c5785d729921aa",
							type: "link",

							fields: {
								url: "https://www.sante.fr/reperage-et-prise-en-soins-des-troubles-du-neuro-developpement-grace-aux-plateformes-de-coordination#p-3",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Retrouvez ici la carte des PCO",
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
							mode: "normal",
							text: ".",
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
							text: "Quel est le coût pour les familles ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "La PCO propose un parcours sans avance de frais pour les familles, dès lors que la plateforme valide le parcours.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "L’Assurance maladie finance les bilans et les interventions réalisés par des professionnels libéraux partenaires, grâce à un forfait d’intervention précoce.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Ce forfait permet aux familles de ne pas payer les consultations de certains professionnels non conventionnés, comme les psychologues, les ergothérapeutes ou les psychomotriciens. Il s’applique uniquement lorsque le parcours est validé par la PCO.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Dans ce cadre, les professionnels ne peuvent pas pratiquer de dépassements d’honoraires.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Ainsi, des séances de psychomotricité, d’ergothérapie ou de psychologie peuvent être proposées sans reste à charge, lorsqu’elles font partie du parcours coordonné.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Lorsque la plateforme oriente vers des professionnels libéraux, les bilans et les interventions restent gratuits pour les familles, dans la limite du montant maximal prévu par le forfait.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Ce dispositif facilite l’accès à des soins spécialisés, souvent difficiles à financer en dehors de ce cadre.",
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
									text: "En savoir plus sur le ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "697373ce31c5785d729921ad",
									type: "link",

									fields: {
										url: "https://www.monparcourshandicap.gouv.fr/aides/troubles-du-neurodeveloppement-autisme-le-forfait-dintervention-precoce",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Forfait d’intervention précoce",
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
									mode: "normal",
									text: ".",
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
					tag: "h2",
					type: "heading",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "À retenir",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Les plateformes de coordination et d’orientation (PCO) permettent :",
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
									text: "d’intervenir tôt,",
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
									text: "de coordonner les bilans,",
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
									text: "d’organiser les interventions",
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
									text: "d’accompagner les familles dès les premiers doutes sur un écart de développement de leur enfant.",
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
							text: "Elles s’appuient sur un vaste réseau de professionnels et sont financées dans le cadre d’un forfait, sans reste à charge pour les familles.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Elles constituent un pilier de la Stratégie nationale 2023-2027 pour les troubles du neurodéveloppemnt (autisme, TDAH, troubles dys, trouble du développement intellectuel) et un levier essentiel pour soutenir le développement des jeunes enfants.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les droits du proche aidant sont reconnus par la loi. Si vous accompagnez au quotidien une personne autiste, vous pouvez bénéficier de droits professionnels, sociaux et financiers pour vous aider.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Cette page vous explique quels droits existent, à quoi ils servent et comment les mobiliser.",
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
							text: "Qui est considéré comme proche aidant ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Le ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973729c31c5785d7299211d",
							type: "link",

							fields: {
								url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018782122",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Code de l’action sociale et des familles",
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
							mode: "normal",
							text: " définit le proche aidant comme une personne qui aide régulièrement une personne en situation de handicap. Cette aide n’est pas exercée à titre professionnel et concerne les actes ou les activités de la vie quotidienne.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Le proche aidant peut être :",
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
									text: "un membre de la famille (parent, conjoint, enfant, frère, sœur, etc.),",
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
									text: "une personne de l’entourage proche (ami, voisin, etc.),",
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
									text: "une personne de confiance désignée par la personne accompagnée.",
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
							id: "6973729c31c5785d7299211e",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/fiches-pratiques-autisme/proche-aidant-personne-autiste/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Parcourez la fiche pratique suivante pour en savoir plus",
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
							mode: "normal",
							text: ".",
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
							text: "Quels sont les droits sociaux et de retraite du proche aidant ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Droit à la retraite",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Si vous n’exercez pas d’activité professionnelle, vous pouvez bénéficier d’une affiliation gratuite au régime général pour valider des trimestres de retraite. Toutes les informations sont mises à jour régulièrement sur le site Service Public :",
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
									id: "6973729c31c5785d72992121",
									type: "link",

									fields: {
										url: "https://www.service-public.fr/particuliers/vosdroits/F32127",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Retraite du salarié",
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
									mode: "normal",
									text: " : majoration d’assurance retraite pour enfant handicapé",
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
									id: "6973729c31c5785d72992122",
									type: "link",

									fields: {
										url: "https://www.service-public.fr/particuliers/vosdroits/F19643",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Retraite dans le privé",
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
									mode: "normal",
									text: " : majoration du montant de la pension de retraite",
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
									id: "6973729c31c5785d72992123",
									type: "link",

									fields: {
										url: "https://www.service-public.fr/particuliers/vosdroits/F16494",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "Retraite d’un fonctionnaire",
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
									mode: "normal",
									text: " : majoration de la pension de retraite de base",
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
							text: "Droits à rémunération",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "La PCH (Prestation de Compensation du Handicap) peut permettre d’employer un proche comme aide humaine. Le dédommagement se fait selon les situations (2025 : 1 209,24 € à 1 451,09 € par mois). Voir le détail des aides ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973729c31c5785d72992124",
							type: "link",

							fields: {
								url: "https://maboussoleaidants.fr/mes-aides",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "ici",
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
							mode: "normal",
							text: ".",
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
							text: "Aides financières pour les proches aidants d’une personne autiste",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
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
							text: "Accompagner une personne autiste au quotidien peut avoir un impact sur la vie professionnelle et les ressources financières de ses proches. Plusieurs aides existent pour compenser la perte de revenus, soutenir les périodes d’absence ou financer du répit. Voici les principaux dispositifs.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "L’Allocation journalière du proche aidant (AJPA)",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "L’AJPA permet de compenser une perte de revenus lorsqu’un aidant prend un ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973729c31c5785d72992125",
							type: "link",

							fields: {
								url: "https://www.service-public.fr/particuliers/vosdroits/F16920",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "congé de proche aidant",
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
							mode: "normal",
							text: ". Elle est versée par la Caisse d’allocations familiales (CAF) ou la Mutualité sociale agricole (MSA).",
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
									text: "Montant :",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " environ 64 € par jour (32 € par demi-journée).",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
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
									text: "Durée :",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " 66 jours maximum sur l’ensemble de la carrière.",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
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
									text: "Démarches :",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " demande à la CAF ou à la MSA avec justificatifs de la situation de la personne aidée.",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					listType: "bullet",
					direction: null,
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973729c31c5785d72992126",
							type: "link",

							fields: {
								url: "https://www.service-public.fr/particuliers/vosdroits/R57305",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "En savoir plus sur l’AJPA",
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
							mode: "normal",
							text: " + *intégration Youtube ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973729c31c5785d72992127",
							type: "link",

							fields: {
								url: "https://www.youtube.com/watch?v=UfGoIMenSO0*",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "https://www.youtube.com/watch?v=UfGoIMenSO0*",
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
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "L’Allocation journalière de présence parentale (AJPP)",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Cette aide est destinée aux parents qui doivent interrompre ou réduire leur activité pour s’occuper d’un enfant atteint de handicap ou de maladie grave.",
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
									text: "**Durée :**jusqu’à 310 jours indemnisés sur 3 ans, dans la limite de 22 jours par mois.",
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
									text: "**Montant :**environ 64 € par jour (32 € par demi-journée).",
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
									text: "**Démarches :**demande à la CAF ou à la MSA, accompagnée d’un certificat médical détaillé.",
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
							id: "6973729c31c5785d72992128",
							type: "link",

							fields: {
								url: "https://www.service-public.fr/particuliers/vosdroits/F15132",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Consulter la fiche AJPP",
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
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Les congés indemnisés pour les aidants",
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
									text: "Congé de proche aidant",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " : jusqu’à un an sur l’ensemble de la carrière, indemnisé par l’AJPA. Consultez notre  ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "6973729c31c5785d72992129",
									type: "link",

									fields: {
										url: "https://maisondelautisme.gouv.fr/soutien-repit-proches-aidants-autisme/",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "fiche pratique « Soutien et répit des aidants ».",
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
									text: "Congé de solidarité familiale",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " : pour accompagner un proche en fin de vie, indemnisé par l’Allocation d’accompagnement de fin de vie.",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
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
									text: "Congé de présence parentale",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: " : pour un enfant gravement malade ou handicapé, indemnisé par l’AJPP.",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					listType: "bullet",
					direction: null,
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Aides financières via la personne aidée",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Certaines aides attribuées à la personne autiste peuvent bénéficier indirectement à l’aidant :",
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
									text: "Prestation de compensation du handicap (PCH)",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: ": peut inclure une aide humaine pour rémunérer un proche aidant (",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "6973729c31c5785d7299212c",
									type: "link",

									fields: {
										url: "https://www.service-public.fr/particuliers/vosdroits/F24610",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "voir la fiche Service-Public",
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
									mode: "normal",
									text: ") à *intégration youtube ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "6973729c31c5785d7299212d",
									type: "link",

									fields: {
										url: "https://www.youtube.com/watch?v=MUXZ9bBQIFE*",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "https://www.youtube.com/watch?v=MUXZ9bBQIFE*",
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
									text: "Allocation d’éducation de l’enfant handicapé (AEEH)",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: ": permet de compenser les frais liés au handicap d’un enfant. à *intégration youtube ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "6973729c31c5785d7299212e",
									type: "link",

									fields: {
										url: "https://www.youtube.com/watch?v=R1RC7Nbq0pA*",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "https://www.youtube.com/watch?v=R1RC7Nbq0pA*",
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
									text: "Allocation personnalisée d’autonomie (APA)",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: ": concerne les personnes âgées de plus de 60 ans en perte d’autonomie. à *intégration youtube ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "6973729c31c5785d7299212f",
									type: "link",

									fields: {
										url: "https://www.youtube.com/watch?v=G3L6uDNkIi0*",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "https://www.youtube.com/watch?v=G3L6uDNkIi0*",
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
							text: "Financement des solutions de répit",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Le droit au répit permet à l’aidant de souffler tout en assurant la continuité de l’accompagnement de son proche.",
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
									text: "Accueil temporaire en établissement",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: "(séjours courts, internats, hébergements relais).",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
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
									text: "Services à domicile",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: "financés en partie par la PCH ou l’APA.",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
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
									text: "Plateformes de répit",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},

								{
									mode: "normal",
									text: "proposant soutien psychologique, activités de détente, séjours aidants/aidés.",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					listType: "bullet",
					direction: null,
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Renseignez-vous auprès de votre ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973729c31c5785d72992130",
							type: "link",

							fields: {
								url: "https://maboussoleaidants.fr/",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "plateforme locale pour les aidants",
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
							mode: "normal",
							text: " ou de la MDPH.",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Vous avez besoin d’aide et d’accompagnement pour demander une aide ?",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},

						{
							mode: "normal",
							text: " Pour vos démarches, vous pouvez contacter le point d’information local, la plateforme d’accompagnement et de répit proche de chez vous, votre mairie ou le CCAS (Centre communal d’action sociale).",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
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
									text: "Retrouvez leurs coordonnées sur ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "6973729c31c5785d72992133",
									type: "link",

									fields: {
										url: "https://www.pour-les-personnes-agees.gouv.fr/acces-annuaires#je-recherche-par-annuaire",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "l’annuaire du site « Pour les personnes âgées »",
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
									mode: "normal",
									text: ".",
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
									text: "Consultez également la page « ",
									type: "text",
									style: "",
									detail: 0,
									format: 0,
									version: 1,
								},

								{
									id: "6973729c31c5785d72992134",
									type: "link",

									fields: {
										url: "https://www.pour-les-personnes-agees.gouv.fr/solutions-pour-les-aidants/trouver-du-soutien/s-informer-et-echanger",
										newTab: false,
										linkType: "custom",
									},
									format: "",
									indent: 0,
									version: 3,

									children: [
										{
											mode: "normal",
											text: "S’informer et échanger",
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
									mode: "normal",
									text: "» du site « Pour les personnes âgées »",
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
							text: "[",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							mode: "normal",
							text: "Important :",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},

						{
							mode: "normal",
							text: " Ma Boussole Aidants propose un simulateur d’éligibilité aux aides financières personnalisé selon votre situation. Les montants, barèmes et conditions évoluent régulièrement. ",
							type: "text",
							style: "",
							detail: 0,
							format: 0,
							version: 1,
						},

						{
							id: "6973730e31c5785d72992151",
							type: "link",

							fields: {
								url: "https://maboussoleaidants.fr/mes-aides?_gl=1*601hof*_up*MQ.._gsMQ..&gclid=CjwKCAjwiY_GBhBEEiwAFaghvqbQ8mKWnC66HGcBHldPkKXjx9J5JAB55axYWSkDcRQzwDCkemLlphoCTJEQAvD_BwE&gbraid=0AAAAABHmlREpO72Ouk29GhXoBOP1d02Uy",
								newTab: true,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Pour les informations les plus récentes, consultez toujours les sites officiels",
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
							mode: "normal",
							text: ".]",
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
					tag: "h3",
					type: "heading",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "En savoir plus sur chaque dispositif",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},
					],
					direction: null,
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "Cliquez sur les liens pour télécharger les détails et synthèses :",
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
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973729c31c5785d72992138",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/rbpp_repit_aidants-droits.pdf",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Droits des aidants (RBPP HAS)",
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
					direction: null,
					textStyle: "",
					textFormat: 0,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973729c31c5785d7299213b",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/Fiche-pratique-Conge-de-proche-aidant-1.pdf",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Congé de proche aidant",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973729c31c5785d7299213e",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/AJPA.png",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "AJPA",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973729c31c5785d72992141",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/Don-de-jours-de-repos-entre-collegues.png",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Don de jours de repos entre collègues",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973729c31c5785d72992144",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/Aide-au-repit-dans-le-cadre-de-lAPA-a-domicile.png",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Aide au répit dans le cadre de l’APA",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973729c31c5785d72992147",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/Aides-fiscales.png",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Aides fiscales",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973729c31c5785d7299214a",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/Remuneration-pour-laide-apportee-a-son-proche.png",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Rémunération pour aide à un proche",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973729c31c5785d7299214d",
							type: "link",

							fields: {
								url: "https://maisondelautisme.gouv.fr/app/uploads/2025/09/AVA-assurance-vieillesse-des-aidants.png",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "Assurance vieillesse des aidants",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					type: "paragraph",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							id: "6973729c31c5785d72992150",
							type: "link",

							fields: {
								url: "https://youtube.com/playlist?list=PLlaTJzFnLi-O6k03g_OmDob4gjfJEvvAx&feature=shared",
								newTab: false,
								linkType: "custom",
							},
							format: "",
							indent: 0,
							version: 3,

							children: [
								{
									mode: "normal",
									text: "WebTV CNSA",
									type: "text",
									style: "",
									detail: 0,
									format: 1,
									version: 1,
								},
							],
							direction: null,
							textFormat: 1,
						},
					],
					direction: null,
					textStyle: "",
					textFormat: 1,
				},

				{
					tag: "h3",
					type: "heading",
					format: "",
					indent: 0,
					version: 1,

					children: [
						{
							mode: "normal",
							text: "À retenir",
							type: "text",
							style: "",
							detail: 0,
							format: 1,
							version: 1,
						},
					],
					direction: null,
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
									text: "Un proche aidant est une personne apportant une aide régulière et non professionnelle à une personne en situation de handicap (famille, entourage ou personne de confiance).",
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
									text: "Les proches aidants peuvent bénéficier de droits professionnels : congé de proche aidant (temps plein ou partiel), allocation journalière du proche aidant (AJPA), ou congé de solidarité familiale.",
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
									text: "Des droits sociaux existent : affiliation gratuite à l’assurance vieillesse, possibilité d’être rémunéré via la PCH.",
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
									text: "Les conditions, montants et barèmes évoluent : référez-vous toujours aux sites officiels (Service Public, CAF, Ma Boussole Aidants) pour les informations à jour. </aside>",
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
			],
			direction: null,
		},
	},
];
