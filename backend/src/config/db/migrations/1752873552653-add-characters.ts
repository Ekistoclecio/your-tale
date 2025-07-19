import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCharacters1752873552653 implements MigrationInterface {
    name = 'AddCharacters1752873552653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "characters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "status" json, "character_sheet" json, "is_active" boolean NOT NULL DEFAULT true, "character_class" character varying(50), "user_id" uuid NOT NULL, "session_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a8edbf04012bfe1a8cbad551d6b" UNIQUE ("name", "session_id"), CONSTRAINT "PK_9d731e05758f26b9315dac5e378" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_c6e648aeaab79e4213def02aba8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_bec94b9b8ecb9167cb981c7a17b" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_bec94b9b8ecb9167cb981c7a17b"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_c6e648aeaab79e4213def02aba8"`);
        await queryRunner.query(`DROP TABLE "characters"`);
    }

}
