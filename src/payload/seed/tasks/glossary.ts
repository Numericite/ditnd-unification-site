import type { Payload } from "payload";

type GlossaryEntry = {
	name: string;
	description: string;
	category?: string;
	link?: string;
};

const categories: string[] = [
	`Association / Réseau`,
	`Dispositif de soins / Parcours`,
	`Dispositif scolaire`,
	`Emploi / Insertion professionnelle`,
	`Formation / Certification`,
	`Méthode / Intervention`,
	`Organisme public / Institutionnel`,
	`Prestation / Aide financière`,
	`Référentiel / Outil diagnostique`,
	`Trouble neurodéveloppemental`,
	`Établissement / Service médico-social`,
	`Établissement sanitaire`,
];

const glossary: GlossaryEntry[] = [
	{
		name: `ANECAMSP`,
		description: `Association nationale des équipes contribuant à l'action médico-sociale précoce. Réseau national des CAMSP, publie un annuaire en ligne.`,
		category: `Association / Réseau`,
		link: `https://anecamsp.org/`,
	},
	{
		name: `CAMSP`,
		description: `Centre d'action médico-sociale précoce. Structure pluridisciplinaire assurant le dépistage, le diagnostic et la prise en charge des enfants de 0 à 6 ans présentant des difficultés de développement.`,
		category: `Établissement / Service médico-social`,
		link: `https://anecamsp.org/vous-aider-les-camsp/`,
	},
	{
		name: `SAVS`,
		description: `Service d'accompagnement à la vie sociale. Service d'aide à l'autonomie et à l'insertion sociale pour adultes handicapés vivant à domicile, sans accompagnement médical.`,
		category: `Établissement / Service médico-social`,
		link: `https://annuaire.action-sociale.org/etablissements/adultes-handicapes/service-d-accompagnement-a-la-vie-sociale--s-a-v-s---446.html`,
	},
	{
		name: `PCO`,
		description: `Plateforme de coordination et d'orientation. Dispositif de repérage et d'intervention précoce pour les enfants de 0 à 12 ans présentant des signes de TND. Permet un accès rapide aux bilans et interventions remboursés.`,
		category: `Dispositif de soins / Parcours`,
		link: `https://handicap.gouv.fr/les-plateformes-de-coordination-et-dorientation-pco`,
	},
	{
		name: `CIM-11`,
		description: `Classification internationale des maladies (11e révision), publiée par l'OMS. La CIM-11 est entrée en vigueur en 2022. Elle classe les TSA, TDI, TDAH, troubles moteurs, troubles spécifiques des apprentissages, troubles de la communication et autres TND dans la section « Troubles neurodéveloppementaux ».`,
		category: `Référentiel / Outil diagnostique`,
		link: `https://icd.who.int/browse/2025-01/mms/fr`,
	},
	{
		name: `CRTLA`,
		description: `Centre de référence des troubles du langage et des apprentissages. Structure hospitalière de référence pour le diagnostic et l'accompagnement des TSLA (troubles dys).`,
		category: `Établissement sanitaire`,
		link: `https://langage-apprentissages.aphp.fr/centre-reference/`,
	},
	{
		name: `Cap emploi`,
		description: `Organismes de placement spécialisés (OPS) exerçant une mission de service public. Chargés de la préparation, de l'accompagnement et du maintien dans l'emploi des personnes en situation de handicap bénéficiaires de la RQTH.`,
		category: `Organisme public / Institutionnel`,
		link: `https://lannuaire.service-public.fr/navigation/cap_emploi`,
	},
	{
		name: `SESSAD`,
		description: `Service d'éducation spéciale et de soins à domicile. Service médico-social intervenant dans les lieux de vie et de scolarisation de l'enfant ou de l'adolescent handicapé.`,
		category: `Établissement / Service médico-social`,
		link: `https://maboussoleaidants.fr/ma-vie-daidant/prendre-des-decisions/scolarisation-enfant-handicap/sessad-service-education-speciale-soins-a-domicile-definition-role-financement`,
	},
	{
		name: `CRTDAH`,
		description: `Centre de ressources pour les troubles déficitaires de l'attention avec hyperactivité. Structure en cours de déploiement, développée en articulation avec les CRA, pour améliorer le repérage et le diagnostic TDAH.`,
		category: `Établissement / Service médico-social`,
		link: `https://sante.gouv.fr/soins-et-maladies/prises-en-charge-specialisees/les-troubles-du-neurodeveloppement/article/tdah-vers-des-centres-ressources-regionaux-pour-un-suivi-de-proximite`,
	},
	{
		name: `UFCV`,
		description: `Union française des centres de vacances. Opérateur national de loisirs proposant des séjours adaptés pour les jeunes et adultes en situation de handicap.`,
		category: `Association / Réseau`,
		link: `https://vacances-adaptees.ufcv.fr/`,
	},
	{
		name: `AGEFIPH`,
		description: `Association de gestion du fonds pour l'insertion professionnelle des personnes handicapées. Collecte et gère les contributions des entreprises privées du secteur marchand n'atteignant pas l'OETH de 6 %.`,
		category: `Organisme public / Institutionnel`,
		link: `https://www.agefiph.fr/`,
	},
	{
		name: `CPAM`,
		description: `Caisse primaire d'assurance maladie. Organisme de service public qui gère l'affiliation et les remboursements de soins pour les assurés sociaux.`,
		category: `Organisme public / Institutionnel`,
		link: `https://www.ameli.fr/`,
	},
	{
		name: `ALD`,
		description: `Affection longue durée. Maladie chronique ou invalidante nécessitant un traitement prolongé et coûteux, permettant une prise en charge à 100 % par l'Assurance maladie.`,
		category: `Dispositif de soins / Parcours`,
		link: `https://www.ameli.fr/assure/droits-demarches/maladie-accident-hospitalisation/affection-longue-duree-ald/`,
	},
	{
		name: `ANIL`,
		description: `Agence nationale pour l'information sur le logement. Réseau national d'information juridique, financière et fiscale sur le logement, notamment sur les travaux d'adaptation au handicap.`,
		category: `Association / Réseau`,
		link: `https://www.anil.org/`,
	},
	{
		name: `CAF`,
		description: `Caisse d'allocations familiales. Organisme de protection sociale chargé de verser les prestations familiales et sociales (AAH, AEEH, PCH, aides au logement…).`,
		category: `Organisme public / Institutionnel`,
		link: `https://www.caf.fr/`,
	},
	{
		name: `CROUS`,
		description: `Centre régional des œuvres universitaires et scolaires. Organisme gérant les services aux étudiants (restauration, logement, aides sociales). Joue un rôle dans l'accompagnement des étudiants handicapés.`,
		category: `Organisme public / Institutionnel`,
		link: `https://www.crous.fr/`,
	},
	{
		name: `PIAL`,
		description: `Pôle inclusif d'accompagnement localisé. Organisation de l'accompagnement des élèves en situation de handicap à l'échelle d'un groupe d'établissements, coordonnant les AESH.`,
		category: `Dispositif scolaire`,
		link: `https://www.education.gouv.fr/ecole-inclusive-le-pial-qu-est-ce-que-c-est-452988`,
	},
	{
		name: `ERSEH`,
		description: `Enseignant référent à la scolarisation des élèves handicapés. Personnel de l'Éducation nationale qui suit la scolarité des élèves en situation de handicap, coordonne les ESS et fait le lien entre l'école et la MDPH.`,
		category: `Dispositif scolaire`,
		link: `https://www.education.gouv.fr/enseignante-referente-de-la-scolarisation-des-eleves-en-situation-de-handicap-erseh-416176`,
	},
	{
		name: `AED`,
		description: `Assistant d'éducation. Personnel de l'Éducation nationale qui accompagne les élèves dans la vie scolaire au quotidien au sein des établissements.`,
		category: `Dispositif scolaire`,
		link: `https://www.education.gouv.fr/etre-assistante-assistant-d-education-416643#:~:text=L'Assistant%20d'%C3%89ducation%20(,communication%20r%C3%A9guli%C3%A8re%20avec%20les%20familles.`,
	},
	{
		name: `CFA`,
		description: `Centre de formation d'apprentis. Établissement proposant des formations en alternance menant à des diplômes professionnels (CAP, Bac pro, BTS…).`,
		category: `Formation / Certification`,
		link: `https://www.education.gouv.fr/le-centre-de-formation-d-apprentis-cfa-creation-fonctionnement-personnels-et-apprentis-2069`,
	},
	{
		name: `CFG`,
		description: `Certificat de formation générale. Certification préparée au collège en SEGPA ou en ULIS, pouvant faire l'objet d'aménagements pour les élèves TND.`,
		category: `Formation / Certification`,
		link: `https://www.education.gouv.fr/le-certificat-de-formation-generale-10823`,
	},
	{
		name: `FFDYS`,
		description: `Fédération française des dys. Fédération nationale regroupant les associations liées aux troubles dys (dyslexie, dysphasie, dyspraxie, dyscalculie, etc.).`,
		category: `Association / Réseau`,
		link: `https://www.ffdys.com/`,
	},
	{
		name: `FIPHFP`,
		description: `Fonds pour l'insertion des personnes handicapées dans la fonction publique. Collecte les contributions des employeurs publics n'atteignant pas l'OETH et finance des actions d'insertion et de maintien dans l'emploi.`,
		category: `Organisme public / Institutionnel`,
		link: `https://www.fiphfp.fr/`,
	},
	{
		name: `AFSGT`,
		description: `Association française du syndrome de Gilles de la Tourette. Association nationale de référence sur le SGT, proposant information, soutien et ressources pour les personnes concernées.`,
		category: `Association / Réseau`,
		link: `https://www.france-tourette.org/`,
	},
	{
		name: `France Travail`,
		description: `Opérateur public du service de l'emploi (anciennement Pôle emploi). Accompagne les demandeurs d'emploi, verse les allocations chômage et aide les entreprises dans leurs recrutements.`,
		category: `Organisme public / Institutionnel`,
		link: `https://www.francetravail.fr/accueil/`,
	},
	{
		name: `HAS`,
		description: `Haute autorité de santé. Autorité publique indépendante qui évalue les médicaments, recommande les bonnes pratiques (RBPP) et améliore la qualité des établissements sanitaires et médico-sociaux.`,
		category: `Organisme public / Institutionnel`,
		link: `https://www.has-sante.fr/`,
	},
	{
		name: `RBPP`,
		description: `Recommandations de bonnes pratiques professionnelles. Documents méthodiques élaborés par la HAS pour guider les professionnels du secteur sanitaire, social et médico-social.`,
		category: `Référentiel / Outil diagnostique`,
		link: `https://www.has-sante.fr/`,
	},
	{
		name: `DSM-5`,
		description: `Manuel diagnostique et statistique des troubles mentaux, 5e édition (Diagnostic and Statistical Manual). Référentiel de classification des troubles psychiatriques et neurodéveloppementaux publié par l'American Psychiatric Association.`,
		category: `Référentiel / Outil diagnostique`,
		link: `https://www.infodrog.ch/files/content/refbases/DSM-5_Manuel-diagnostique-et-statistique-des-troubles-mentaux.pdf`,
	},
	{
		name: `VSL`,
		description: `Véhicule sanitaire léger. Moyen de transport médical utilisé pour acheminer les patients vers leur lieu de soins. Peut être prescrit dans le cadre d'une ALD pour les personnes TND.`,
		category: `Dispositif de soins / Parcours`,
		link: `https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006919238/2005-07-26`,
	},
	{
		name: `CNIA`,
		description: `Certificat national autisme. Formation certifiante proposée par la Maison de l'autisme / GNCRA pour les professionnels souhaitant acquérir une expertise sur l'autisme et les TND.`,
		category: `Formation / Certification`,
		link: `https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042241375`,
	},
	{
		name: `ETP`,
		description: `Éducation thérapeutique du patient (ou de la personne). Démarche centrée sur la personne qui aide à mieux comprendre sa pathologie et à acquérir des compétences d'autogestion. Des programmes ETP spécifiques existent pour les personnes TSA.`,
		category: `Dispositif de soins / Parcours`,
		link: `https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042845767`,
	},
	{
		name: `CPF`,
		description: `Compte personnel de formation. Dispositif permettant à tout actif d'accumuler des droits à la formation tout au long de sa vie professionnelle.`,
		category: `Emploi / Insertion professionnelle`,
		link: `https://www.moncompteformation.gouv.fr/`,
	},
	{
		name: `APA`,
		description: `Allocation personnalisée d'autonomie. Aide financière accordée par le conseil départemental aux personnes âgées en perte d'autonomie, finançant des aides humaines ou techniques à domicile.`,
		category: `Prestation / Aide financière`,
		link: `https://www.monparcourshandicap.gouv.fr/aides/lallocation-personnalisee-dautonomie-apa`,
	},
	{
		name: `AVS`,
		description: `Auxiliaire de vie scolaire. Ancien terme remplacé par AESH (accompagnant des élèves en situation de handicap) depuis 2014.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/aesh`,
	},
	{
		name: `AESH`,
		description: `Accompagnant des élèves en situation de handicap (anciennement AVS). Agent de l'Éducation nationale qui aide les élèves en situation de handicap dans leurs activités scolaires.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/aesh`,
	},
	{
		name: `CAA`,
		description: `Communication alternative et améliorée. Ensemble des outils et méthodes permettant de communiquer autrement que par la parole (pictogrammes, PECS, appareils de génération vocale, langue des signes…). C'est un droit pour toute personne ne pouvant s'exprimer verbalement.`,
		category: `Méthode / Intervention`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/caa`,
	},
	{
		name: `CDAPH`,
		description: `Commission des droits et de l'autonomie des personnes handicapées. Commission de la MDPH qui statue sur les demandes de droits et prestations (RQTH, AAH, PCH, orientations scolaires et médico-sociales).`,
		category: `Organisme public / Institutionnel`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/cdaph`,
	},
	{
		name: `CMP`,
		description: `Centre médico-psychologique. Unité d'accueil et de coordination pour des soins psychiatriques en milieu ouvert (prévention, diagnostic, soins ambulatoires) pour enfants et adultes.`,
		category: `Établissement / Service médico-social`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/cmp`,
	},
	{
		name: `CMPP`,
		description: `Centre médico-psycho-pédagogique. Structure de diagnostic et de soins pour enfants, adolescents et jeunes adultes jusqu'à 20 ans présentant des difficultés de langage, d'apprentissage ou des troubles psychomoteurs.`,
		category: `Établissement / Service médico-social`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/cmpp`,
	},
	{
		name: `ESS`,
		description: `Équipe de suivi de scolarisation. Réunion annuelle rassemblant l'élève, sa famille, l'enseignant, l'AESH et les professionnels pour évaluer le PPS et adapter l'accompagnement scolaire.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/ess`,
	},
	{
		name: `FALC`,
		description: `Facile à lire et à comprendre. Méthode de rédaction simplifiant les textes pour les rendre accessibles aux personnes ayant des difficultés de compréhension (dont les personnes TND, DI, etc.).`,
		category: `Méthode / Intervention`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/falc`,
	},
	{
		name: `MDPH`,
		description: `Maison départementale des personnes handicapées. Guichet unique d'information, d'accueil et d'accompagnement pour les personnes handicapées et leurs familles. Instruit les demandes via la CDAPH.`,
		category: `Organisme public / Institutionnel`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/mdph`,
	},
	{
		name: `Mission locale`,
		description: `Structure de proximité accompagnant les jeunes de 16 à 25 ans dans leur insertion professionnelle et sociale. Partie du service public de l'emploi.`,
		category: `Organisme public / Institutionnel`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/mission-locale`,
	},
	{
		name: `PAEH`,
		description: `Plan d'accompagnement de l'étudiant handicapé. Document élaboré par le service handicap de l'établissement d'enseignement supérieur définissant les aménagements accordés à l'étudiant en situation de handicap.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/paeh`,
	},
	{
		name: `SAAD`,
		description: `Service d'aide et d'accompagnement à domicile. Structure intervenant au domicile de personnes handicapées ou âgées pour les aider dans les actes essentiels de la vie quotidienne.`,
		category: `Établissement / Service médico-social`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/saad`,
	},
	{
		name: `SAMSAH`,
		description: `Service d'accompagnement médico-social pour adultes handicapés. Service intervenant à domicile pour accompagner des adultes handicapés dans leur vie sociale et professionnelle.`,
		category: `Établissement / Service médico-social`,
		link: `https://www.monparcourshandicap.gouv.fr/glossaire/samsah`,
	},
	{
		name: `IME`,
		description: `Institut médico-éducatif. Établissement médico-social accueillant des enfants et adolescents (3–20 ans) en situation de handicap avec déficience intellectuelle. Assure soins, éducation et enseignement.`,
		category: `Établissement / Service médico-social`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/comment-seffectue-la-scolarisation-en-etablissement-medico-social-ems#:~:text=Les%20instituts%20m%C3%A9dico%2D%C3%A9ducatifs%20(IME,dans%20un%20%C3%A9tablissement%20scolaire%20proche.`,
	},
	{
		name: `IMP`,
		description: `Institut médico-pédagogique. Section de l'IME accueillant des enfants de 3 à 14 ans.`,
		category: `Établissement / Service médico-social`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/comment-seffectue-la-scolarisation-en-etablissement-medico-social-ems#:~:text=Les%20instituts%20m%C3%A9dico%2D%C3%A9ducatifs%20(IME,dans%20un%20%C3%A9tablissement%20scolaire%20proche.`,
	},
	{
		name: `IMPRO`,
		description: `Institut médico-professionnel. Section de l'IME accueillant des jeunes de 14 à 20 ans, axée sur la formation préprofessionnelle.`,
		category: `Établissement / Service médico-social`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/comment-seffectue-la-scolarisation-en-etablissement-medico-social-ems#:~:text=Les%20instituts%20m%C3%A9dico%2D%C3%A9ducatifs%20(IME,dans%20un%20%C3%A9tablissement%20scolaire%20proche.`,
	},
	{
		name: `PAI`,
		description: `Projet d'accueil individualisé. Protocole établi entre la famille, l'établissement scolaire et les professionnels de santé pour organiser l'accueil d'un enfant souffrant de maladie chronique ou d'allergie.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/ppre-pai-pap-pps-en-quoi-consistent-les-differentes-possibilites-dappui-la-scolarisation`,
	},
	{
		name: `PAP`,
		description: `Plan d'accompagnement personnalisé. Dispositif scolaire permettant des aménagements pédagogiques pour les élèves présentant des troubles des apprentissages, sans nécessiter de passage en MDPH.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/ppre-pai-pap-pps-en-quoi-consistent-les-differentes-possibilites-dappui-la-scolarisation`,
	},
	{
		name: `PPRE`,
		description: `Programme personnalisé de réussite éducative. Dispositif scolaire de soutien pour les élèves en grande difficulté, mis en place par l'équipe pédagogique sans passage obligatoire en MDPH.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/ppre-pai-pap-pps-en-quoi-consistent-les-differentes-possibilites-dappui-la-scolarisation`,
	},
	{
		name: `PPS`,
		description: `Projet personnalisé de scolarisation. Document élaboré par la MDPH définissant les modalités de scolarisation et les aides nécessaires pour un élève en situation de handicap.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/ppre-pai-pap-pps-en-quoi-consistent-les-differentes-possibilites-dappui-la-scolarisation`,
	},
	{
		name: `UEEA`,
		description: `Unité d'enseignement élémentaire autisme. Classe spécialisée au sein d'une école élémentaire ordinaire, accueillant des enfants autistes dans un environnement inclusif avec pratiques adaptées.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/quelles-sont-les-differentes-modalites-de-scolarisation-de-lecole-maternelle-au-lycee`,
	},
	{
		name: `UEMA`,
		description: `Unité d'enseignement en maternelle autisme. Classe spécialisée au sein d'une école maternelle ordinaire, accueillant de jeunes enfants autistes.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/quelles-sont-les-differentes-modalites-de-scolarisation-de-lecole-maternelle-au-lycee`,
	},
	{
		name: `GEVA-Sco`,
		description: `Guide d'évaluation des besoins de compensation en matière de scolarisation. Outil utilisé par la MDPH et l'équipe éducative pour évaluer les besoins d'un élève handicapé et définir son PPS.`,
		category: `Référentiel / Outil diagnostique`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/quest-ce-que-le-geva-sco`,
	},
	{
		name: `ULIS`,
		description: `Unité localisée pour l'inclusion scolaire. Dispositif collectif de scolarisation pour élèves en situation de handicap au sein d'un établissement ordinaire (école, collège, lycée), permettant une inclusion partielle en classe ordinaire.`,
		category: `Dispositif scolaire`,
		link: `https://www.monparcourshandicap.gouv.fr/scolarite/quest-ce-quune-ulis-unite-localisee-pour-linclusion-scolaire`,
	},
	{
		name: `PICA`,
		description: `Trouble caractérisé par l'ingestion persistante de substances non comestibles (terre, papier, métal…). Peut être associé aux TND, notamment au TDI et au TSA.`,
		category: `Trouble neurodéveloppemental`,
		link: `https://www.msdmanuals.com/fr/accueil/troubles-mentaux/troubles-des-conduites-alimentaires-et-du-comportement-alimentaire/pica`,
	},
	{
		name: `ARFID`,
		description: `Avoidant/Restrictive Food Intake Disorder. Trouble de l'évitement ou de la restriction alimentaire, fréquent dans les TND, caractérisé par une alimentation très sélective non liée à une image corporelle distordue.`,
		category: `Trouble neurodéveloppemental`,
		link: `https://www.msdmanuals.com/fr/professional/troubles-psychiatriques/troubles-de-l-alimentation-et-du-comportement-alimentaire/trouble-de-la-prise-alimentaire-%C3%A9vitant-restrictif`,
	},
	{
		name: `OETH`,
		description: `Obligation d'emploi des travailleurs handicapés. Obligation légale pour les employeurs de plus de 20 salariés d'employer au moins 6 % de travailleurs handicapés reconnus RQTH.`,
		category: `Emploi / Insertion professionnelle`,
		link: `https://www.oeth.org/`,
	},
	{
		name: `ITEP`,
		description: `Institut thérapeutique, éducatif et pédagogique. Établissement médico-social accueillant des enfants et adolescents présentant des troubles du comportement et de la conduite.`,
		category: `Établissement / Service médico-social`,
		link: `https://www.psycom.org/sorienter/le-dictionnaire-des-lieux/institut-therapeutique-educatif-et-pedagogique-itep/`,
	},
	{
		name: `GEM`,
		description: `Groupement d'entraide mutuelle. Structure de soutien par les pairs pour personnes en situation de fragilité psychique ou de handicap psychique, financée par la CNSA.`,
		category: `Association / Réseau`,
		link: `https://www.psycom.org/sorienter/les-groupes-dentraide-mutuelle/`,
	},
	{
		name: `APL`,
		description: `Aide personnalisée au logement. Aide financière de la CAF versée directement au bailleur pour réduire le montant du loyer.`,
		category: `Prestation / Aide financière`,
		link: `https://www.service-public.fr/particuliers/vosdroits/F12006`,
	},
	{
		name: `AAH`,
		description: `Allocation aux adultes handicapés. Aide financière versée par la CAF aux personnes en situation de handicap dont les ressources sont limitées, sous conditions d'âge et de taux d'incapacité.`,
		category: `Prestation / Aide financière`,
		link: `https://www.service-public.fr/particuliers/vosdroits/F12242`,
	},
	{
		name: `ALS`,
		description: `Allocation de logement sociale. Aide au logement versée par la CAF aux personnes qui ne peuvent bénéficier ni de l'APL ni de l'ALF.`,
		category: `Prestation / Aide financière`,
		link: `https://www.service-public.fr/particuliers/vosdroits/F1280`,
	},
	{
		name: `ALF`,
		description: `Allocation de logement familiale. Aide au logement versée par la CAF aux familles avec enfants ou à charge qui n'ont pas droit à l'APL.`,
		category: `Prestation / Aide financière`,
		link: `https://www.service-public.fr/particuliers/vosdroits/F13132`,
	},
	{
		name: `PCH`,
		description: `Prestation de compensation du handicap. Aide financière versée par le conseil départemental pour financer les besoins liés à la perte d'autonomie (aides humaines, techniques, aménagement du logement…).`,
		category: `Prestation / Aide financière`,
		link: `https://www.service-public.fr/particuliers/vosdroits/F14202`,
	},
	{
		name: `AEEH`,
		description: `Allocation d'éducation de l'enfant handicapé. Prestation familiale versée par la CAF pour aider les parents à faire face aux dépenses liées à l'éducation d'un enfant en situation de handicap.`,
		category: `Prestation / Aide financière`,
		link: `https://www.service-public.fr/particuliers/vosdroits/F14809`,
	},
	{
		name: `AJPP`,
		description: `Allocation journalière de présence parentale. Aide financière versée aux parents qui doivent réduire ou cesser leur activité pour s'occuper d'un enfant atteint d'une maladie grave, d'un handicap ou d'un accident.`,
		category: `Prestation / Aide financière`,
		link: `https://www.service-public.fr/particuliers/vosdroits/F15132`,
	},
	{
		name: `DALO`,
		description: `Droit au logement opposable. Dispositif permettant à une personne dont la situation de logement est bloquée (malgré des démarches actives) de faire reconnaître son droit à un logement devant une commission de médiation.`,
		category: `Prestation / Aide financière`,
		link: `https://www.service-public.fr/particuliers/vosdroits/F16247`,
	},
	{
		name: `CMI`,
		description: `Carte mobilité inclusion. Carte délivrée par la MDPH remplaçant les anciennes cartes d'invalidité et de priorité. Permet des droits spécifiques (priorité dans les files, stationnement, réductions de transport).`,
		category: `Prestation / Aide financière`,
		link: `https://www.service-public.fr/particuliers/vosdroits/F34049`,
	},
	{
		name: `AJPA`,
		description: `Allocation journalière du proche aidant. Indemnisation versée au proche aidant qui cesse ou réduit son activité professionnelle pour s'occuper d'un proche en situation de handicap ou de perte d'autonomie.`,
		category: `Prestation / Aide financière`,
		link: `https://www.service-public.fr/particuliers/vosdroits/R57305`,
	},
	{
		name: `EA`,
		description: `Entreprise adaptée. Entreprise du milieu ordinaire de travail employant majoritairement des travailleurs handicapés reconnus RQTH.`,
		category: `Emploi / Insertion professionnelle`,
		link: `https://www.service-public.fr/particuliers/vosdroits/R62416`,
	},
	{
		name: `MASP`,
		description: `Mesure d'accompagnement social personnalisé. Mesure civile d'aide à la gestion des prestations sociales, proposée à une personne majeure qui rencontre des difficultés à gérer ses ressources.`,
		category: `Dispositif de soins / Parcours`,
		link: `https://www.service-public.gouv.fr/particuliers/vosdroits/F1336`,
	},
	{
		name: `FHTH`,
		description: `Foyer d'hébergement pour travailleur handicapé. Structure médico-sociale offrant un hébergement aux personnes handicapées qui travaillent en ESAT ou en EA.`,
		category: `Établissement / Service médico-social`,
		link: `https://www.service-public.gouv.fr/particuliers/vosdroits/F15234`,
	},
	{
		name: `RQTH`,
		description: `Reconnaissance de la qualité de travailleur handicapé. Statut accordé par la MDPH/CDAPH ouvrant droit à des mesures spécifiques pour l'emploi et le maintien dans l'emploi.`,
		category: `Emploi / Insertion professionnelle`,
		link: `https://www.service-public.gouv.fr/particuliers/vosdroits/F1650`,
	},
	{
		name: `ESAT`,
		description: `Établissement et service d'accompagnement par le travail. Structure permettant à des adultes handicapés d'exercer une activité professionnelle en milieu protégé avec un soutien médico-social.`,
		category: `Emploi / Insertion professionnelle`,
		link: `https://www.service-public.gouv.fr/particuliers/vosdroits/F1654`,
	},
	{
		name: `FDV`,
		description: `Foyer de vie (ou foyer occupationnel). Structure médico-sociale accueillant des adultes handicapés dont la capacité de travail est trop réduite pour un ESAT mais qui disposent d'une certaine autonomie.`,
		category: `Établissement / Service médico-social`,
		link: `https://www.service-public.gouv.fr/particuliers/vosdroits/F2005`,
	},
	{
		name: `SEGPA`,
		description: `Section d'enseignement général et professionnel adapté. Section au sein d'un collège accueillant des élèves en grande difficulté scolaire ou présentant des troubles des apprentissages.`,
		category: `Dispositif scolaire`,
		link: `https://www.service-public.gouv.fr/particuliers/vosdroits/F32752#:~:text=Une%20classe%20SegpaSegpa%20%3A%20Section,est%20int%C3%A9gr%C3%A9e%20dans%20un%20coll%C3%A8ge.`,
	},
	{
		name: `PARA`,
		description: `Plateforme d'accompagnement et de répit des aidants. Autre appellation des PFR (plateformes de répit). Accompagnent les aidants d'une personne en situation de handicap ou de dépendance.`,
		category: `Dispositif de soins / Parcours`,
		link: `https://www.soutenirlesaidants.fr/recherche/structures/`,
	},
	{
		name: `PFR`,
		description: `Plateforme de répit pour proches aidants (aussi appelée PARA). Structure accompagnant les proches aidants de personnes en situation de handicap ou de dépendance, proposant écoute, soutien et solutions de répit.`,
		category: `Dispositif de soins / Parcours`,
		link: `https://www.soutenirlesaidants.fr/recherche/structures/`,
	},
	{
		name: `UNAF`,
		description: `Union nationale des associations familiales. Réseau associatif représentant les familles auprès des pouvoirs publics. Propose notamment une information sur la tutelle et la curatelle pour les familles aidantes.`,
		category: `Association / Réseau`,
		link: `https://www.unaf.fr/`,
	},
	{
		name: `UNAPEI`,
		description: `Union nationale des associations de parents, de personnes handicapées mentales et de leurs amis. Fédération associative représentant les personnes avec déficience intellectuelle et leurs familles.`,
		category: `Association / Réseau`,
		link: `https://www.unapei.org/`,
	},
	{
		name: `VACAF`,
		description: `Vacances et familles. Service de la CAF finançant des aides pour partir en vacances dans des centres de vacances labellisés, accessible aux personnes handicapées.`,
		category: `Association / Réseau`,
		link: `https://www.vacaf.org/`,
	},
	{
		name: `ABA`,
		description: `Applied Behavior Analysis (analyse appliquée du comportement). Approche d'intervention basée sur les principes d'apprentissage du comportement, recommandée par la HAS pour les enfants TSA sous la forme d'interventions comportementales intensives précoces (EIBI).`,
		category: `Méthode / Intervention`,
	},
	{
		name: `CBIT`,
		description: `Comprehensive Behavioral Intervention for Tics. Approche comportementale spécialisée dans le traitement des tics dans le cadre du syndrome de Gilles de la Tourette (SGT). Recommandée en première intention.`,
		category: `Méthode / Intervention`,
	},
	{
		name: `CRA`,
		description: `Centre de ressources autisme. Structure régionale d'expertise pluridisciplinaire sur l'autisme : diagnostic, formation des professionnels, information des familles. Piloté par les ARS.`,
		category: `Établissement / Service médico-social`,
	},
	{
		name: `Dys (troubles)`,
		description: `Terme générique désignant les troubles spécifiques des apprentissages : dyslexie, dysorthographie, dysphasie, dyscalculie, etc. Ils appartiennent à la famille des TND.`,
		category: `Trouble neurodéveloppemental`,
	},
	{
		name: `EIBI`,
		description: `Early Intensive Behavioral Intervention (interventions comportementales intensives précoces). Approche d'intervention précoce et intensive fondée sur les principes de l'ABA, recommandée par la HAS pour les jeunes enfants TSA.`,
		category: `Méthode / Intervention`,
	},
	{
		name: `ESDM`,
		description: `Early Start Denver Model. Modèle d'intervention développemental en milieu naturel, recommandé pour les jeunes enfants TSA. Combine approches développementales et comportementales.`,
		category: `Méthode / Intervention`,
	},
	{
		name: `GNCRA`,
		description: `Groupement national des centres de ressources autisme. Coordonne et anime le réseau des CRA en France. Organisé sous forme de GCSMS. Produit des formations, outils et ressources nationales.`,
		category: `Association / Réseau`,
	},
	{
		name: `JASPER`,
		description: `Joint Attention, Symbolic Play, Engagement and Regulation. Modèle d'intervention développemental en milieu naturel recommandé pour les enfants TSA, axé sur l'attention conjointe et le jeu symbolique.`,
		category: `Méthode / Intervention`,
	},
	{
		name: `LPC`,
		description: `Langage parlé complété. Code gestuel manuel qui accompagne la parole pour en lever les ambiguïtés, facilitant la compréhension orale des personnes sourdes ou malentendantes et des personnes avec TND.`,
		category: `Méthode / Intervention`,
	},
	{
		name: `LSF`,
		description: `Langue des signes française. Langue visuo-gestuelle naturelle utilisée par les personnes sourdes ou malentendantes en France. Peut aussi être utilisée comme outil de CAA.`,
		category: `Méthode / Intervention`,
	},
	{
		name: `PECS`,
		description: `Picture Exchange Communication System. Système de communication par échange d'images, utilisé comme outil de CAA avec les enfants ou adultes non verbaux ou peu verbaux, notamment dans le TSA.`,
		category: `Méthode / Intervention`,
	},
	{
		name: `SGT`,
		description: `Syndrome de Gilles de la Tourette. TND caractérisé par des tics moteurs et vocaux multiples, chroniques, souvent associé à un TDAH et/ou un TOC. Reconnu depuis 2022 dans la CIM-11.`,
		category: `Trouble neurodéveloppemental`,
	},
	{
		name: `TCC`,
		description: `Thérapies cognitives et comportementales. Approche psychothérapeutique fondée sur l'analyse des pensées et des comportements. Recommandée pour certains troubles associés aux TND (anxiété, TOC, dépression).`,
		category: `Méthode / Intervention`,
	},
	{
		name: `TDA/H`,
		description: `Trouble du déficit de l'attention avec ou sans hyperactivité. TND caractérisé par des difficultés d'attention, une impulsivité et/ou une hyperactivité.`,
		category: `Trouble neurodéveloppemental`,
	},
	{
		name: `TDC`,
		description: `Trouble développemental de la coordination (anciennement dyspraxie). TND caractérisé par des difficultés motrices persistantes affectant les activités quotidiennes et les apprentissages.`,
		category: `Trouble neurodéveloppemental`,
	},
	{
		name: `TDI`,
		description: `Trouble du développement intellectuel (anciennement déficience intellectuelle). Caractérisé par des limitations significatives du fonctionnement intellectuel et du comportement adaptatif.`,
		category: `Trouble neurodéveloppemental`,
	},
	{
		name: `TDL`,
		description: `Trouble développemental du langage (anciennement dysphasie). TND caractérisé par des difficultés persistantes dans l'acquisition et l'utilisation du langage oral, sans cause sensorielle ou neurologique identifiée.`,
		category: `Trouble neurodéveloppemental`,
	},
	{
		name: `TEACCH`,
		description: `Treatment and Education of Autistic and related Communication-Handicapped CHildren. Approche structurée d'enseignement et d'accompagnement pour les personnes TSA, basée sur l'organisation visuelle de l'environnement.`,
		category: `Méthode / Intervention`,
	},
	{
		name: `TED`,
		description: `Troubles envahissants du développement. Ancienne catégorie diagnostique regroupant l'autisme, le syndrome d'Asperger et autres, aujourd'hui remplacée par TSA dans le DSM-5 et la CIM-11.`,
		category: `Trouble neurodéveloppemental`,
	},
	{
		name: `TND`,
		description: `Troubles du neurodéveloppement. Terme générique regroupant l'ensemble des troubles d'origine neurodéveloppementale : TSA, TDA/H, TDI, TSLA, TDC, TDL, SGT, etc.`,
		category: `Trouble neurodéveloppemental`,
	},
	{
		name: `TSA`,
		description: `Troubles du spectre de l'autisme. Trouble neurodéveloppemental caractérisé par des difficultés persistantes dans la communication et les interactions sociales, et des comportements répétitifs ou intérêts restreints.`,
		category: `Trouble neurodéveloppemental`,
	},
];

async function seedCategories(payload: Payload): Promise<Map<string, number>> {
	const categoryIds = new Map<string, number>();
	for (const name of categories) {
		try {
			const created = await payload.create({
				collection: "glossary-categories",
				data: { name },
			});
			categoryIds.set(name, created.id);
		} catch (error) {
			throw new Error(
				`Error creating glossary category ${name} with error ${error}`,
			);
		}
	}
	return categoryIds;
}

async function createGlossaryEntry(
	payload: Payload,
	data: GlossaryEntry,
	categoryIds: Map<string, number>,
): Promise<void> {
	try {
		await payload.create({
			collection: "glossary",
			data: {
				name: data.name,
				description: data.description,
				link: data.link,
				category: data.category ? categoryIds.get(data.category) : undefined,
			},
		});
	} catch (error) {
		throw new Error(
			`Error creating glossary entry ${data.name} with error ${error}`,
		);
	}
}

export async function seedGlossary(payload: Payload) {
	const categoryIds = await seedCategories(payload);
	for (const entry of glossary) {
		await createGlossaryEntry(payload, entry, categoryIds);
	}
}
