import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TABLE "courses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"conditions_id" integer
  );

  ALTER TABLE "courses" DROP CONSTRAINT "courses_condition_id_conditions_id_fk";

  DROP INDEX "courses_condition_idx";
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_conditions_fk" FOREIGN KEY ("conditions_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "courses_rels_order_idx" ON "courses_rels" USING btree ("order");
  CREATE INDEX "courses_rels_parent_idx" ON "courses_rels" USING btree ("parent_id");
  CREATE INDEX "courses_rels_path_idx" ON "courses_rels" USING btree ("path");
  CREATE INDEX "courses_rels_conditions_id_idx" ON "courses_rels" USING btree ("conditions_id");
  INSERT INTO "courses_rels" ("order", "parent_id", "path", "conditions_id")
  SELECT 1, "id", 'conditions', "condition_id" FROM "courses" WHERE "condition_id" IS NOT NULL;
  ALTER TABLE "courses" DROP COLUMN "condition_id";`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "courses" ADD COLUMN "condition_id" integer;
  UPDATE "courses" SET "condition_id" = (
  	SELECT "courses_rels"."conditions_id" FROM "courses_rels"
  	WHERE "courses_rels"."parent_id" = "courses"."id"
  		AND "courses_rels"."path" = 'conditions'
  		AND "courses_rels"."conditions_id" IS NOT NULL
  	ORDER BY "courses_rels"."order" NULLS LAST, "courses_rels"."id"
  	LIMIT 1
  );
  ALTER TABLE "courses" ALTER COLUMN "condition_id" SET NOT NULL;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "courses_condition_idx" ON "courses" USING btree ("condition_id");
  ALTER TABLE "courses_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "courses_rels" CASCADE;`);
}
