import type { PostgresAdapter } from "@payloadcms/db-postgres";
import type { PayloadRequest } from "payload";
import {
	pgTable,
	text,
	vector,
} from "@payloadcms/db-postgres/drizzle/pg-core";

export const isAdmin = ({ req }: { req: PayloadRequest }) => {
	const user = req.user;

	if (!user) return false;

	return user.role === "admin";
};

export const addPracticalGuidesTable: PostgresAdapter["beforeSchemaInit"][number] =
	({ schema }) => {
		return {
			...schema,
			tables: {
				...schema.tables,
				practical_guide_search_vectors: pgTable("practical_guide_search_vectors", {
					doc_id: text("doc_id").primaryKey(),
					text: text("text").notNull(),
				}),
			},
		};
	};

export const addPracticalGuidesTableVector: PostgresAdapter["afterSchemaInit"][number] =
	({ schema, extendTable }) => {
		const practicalGuideVectorsTable = schema.tables.practical_guide_search_vectors;

		if (!practicalGuideVectorsTable) return schema;

		extendTable({
			table: practicalGuideVectorsTable,
			columns: {
				embedding: vector("embedding", { dimensions: 1536 }).notNull(),
			},
		});

		return schema;
	};
