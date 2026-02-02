import type { BasePayload } from "payload";

export default async function homeTask(payload: BasePayload) {
	await payload.updateGlobal({
		slug: "home",
		data: {
			header: {
				title:
					"Plateforme nationale du TSA et des troubles du neuro-développement",
				description:
					"La plateforme nationale au service des personnes concernées par un trouble du neurodéveloppement, les parents, et les professionnels.",
			},
			tiles: {
				description:
					"Cyncentrism kontrakemi. Perlogi proaktiv. Emsocial transfiering. Medeltism androstik stereomodern beteendedesign. Realogi transdiktisk om än posttyp. Pseudotiv kontradiktisk. Mytofiering FAR det heteropod suprapatologi. Kvasitris agnostigyn absion anamatisk.",
			},
			mostViewedGuides: {
				title: "Fiches pratiques les plus lues",
				description:
					"Cyncentrism kontrakemi. Perlogi proaktiv. Emsocial transfiering. Medeltism androstik stereomodern beteendedesign. Realogi transdiktisk om än posttyp. Pseudotiv kontradiktisk. Mytofiering FAR det heteropod suprapatologi. Kvasitris agnostigyn absion anamatisk.",
			},
		},
	});

	payload.logger.info("Home content seeded successfully");
}
