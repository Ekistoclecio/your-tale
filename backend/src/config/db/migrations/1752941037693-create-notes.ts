import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotes1752941037693 implements MigrationInterface {
    name = 'CreateNotes1752941037693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255), "content" text NOT NULL, "is_private" boolean NOT NULL DEFAULT false, "tags" json, "session_id" uuid NOT NULL, "author_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_61f3e1f13a15b883ae34a9e28c9" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_35b89a50cb9203dccff44136519" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_35b89a50cb9203dccff44136519"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_61f3e1f13a15b883ae34a9e28c9"`);
        await queryRunner.query(`DROP TABLE "notes"`);
    }

}
