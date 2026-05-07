import type { NextApiRequest, NextApiResponse } from "next";
import { getGlobalData } from "~/server/global-data";

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const data = await getGlobalData();
		res.setHeader("Cache-Control", "public, max-age=30, s-maxage=60");
		res.status(200).json(data);
	} catch (err) {
		console.error("[api/global-data] failed:", err);
		res.status(500).json({ error: "Failed to load global data" });
	}
}
