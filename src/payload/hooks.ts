import type { PostgresAdapter } from "@payloadcms/db-postgres";
import type { PayloadRequest } from "payload";
import {
	integer,
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
				practical_guide_vectors: pgTable("practical_guide_vectors", {
					id: integer("id").primaryKey(),
					doc_id: text("doc_id").notNull(),
					chunk_index: integer("chunk_index").notNull(),
					text: text("text").notNull(),
				}),
			},
		};
	};

export const addPracticalGuidesTableVector: PostgresAdapter["afterSchemaInit"][number] =
	({ schema, extendTable }) => {
		const practicalGuideVectorsTable = schema.tables.practical_guide_vectors;

		if (!practicalGuideVectorsTable) return schema;

		extendTable({
			table: practicalGuideVectorsTable,
			columns: {
				embedding: vector("embedding", { dimensions: 384 }).notNull(),
			},
			// extraConfig: (table) => ({
			// 	embeddingIndex: index("embeddingIndex").using(
			// 		"hnsw",
			// 		table.embedding.op("vector_cosine_ops"),
			// 	),
			// }),
		});

		return schema;
	};
