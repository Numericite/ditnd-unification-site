import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import {
	type ImportSource,
	importCourses,
} from "~/payload/import/coursesImport";
import type { CoursesImportReport } from "~/payload/import/coursesImportTypes";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
	const payload = await getPayload({ config: configPromise });

	const { user } = await payload.auth({ headers: req.headers });
	if (!user) {
		return NextResponse.json({ error: "Non connecté" }, { status: 401 });
	}
	if (user.role !== "admin" && user.role !== "editor") {
		return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
	}

	let formData: FormData;
	try {
		formData = await req.formData();
	} catch {
		return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
	}

	const files = formData
		.getAll("files")
		.filter((f): f is File => f instanceof File);
	if (!files.length) {
		return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
	}

	const unreadable: CoursesImportReport["rejected"] = [];
	const sources: ImportSource[] = [];
	for (const file of files) {
		if (file.size > MAX_FILE_SIZE) {
			unreadable.push({
				title: null,
				source: file.name,
				reason: "Fichier trop volumineux (5 Mo maximum).",
			});
			continue;
		}
		try {
			const text = (await file.text()).replace(/^\uFEFF/, "");
			sources.push({ name: file.name, data: JSON.parse(text) });
		} catch {
			unreadable.push({
				title: null,
				source: file.name,
				reason: "Fichier illisible : ce n'est pas un JSON valide.",
			});
		}
	}

	try {
		const report = await importCourses({ payload, user, sources });
		report.rejected.unshift(...unreadable);
		return NextResponse.json(report);
	} catch (error) {
		payload.logger.error({ err: error, msg: "[CoursesImport]" });
		return NextResponse.json(
			{
				error: "L'import a échoué. Réessayez ou contactez l'équipe technique.",
			},
			{ status: 500 },
		);
	}
}
