import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessions1752718138509 implements MigrationInterface {
    name = 'CreateSessions1752718138509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."session_status_enum" AS ENUM('not_started', 'active', 'ended')`);
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "is_public" boolean NOT NULL DEFAULT false, "join_after_start" boolean NOT NULL DEFAULT false, "player_limit" integer NOT NULL, "is_ai_master" boolean NOT NULL DEFAULT false, "start_date" TIMESTAMP NOT NULL, "status" "public"."session_status_enum" NOT NULL DEFAULT 'not_started', "join_code" character varying NOT NULL, "current_players" integer NOT NULL DEFAULT '0', "settings" json, "last_activity" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" uuid NOT NULL, CONSTRAINT "UQ_58218950ec0d266a2049a0a86ef" UNIQUE ("join_code"), CONSTRAINT "UQ_58218950ec0d266a2049a0a86ef" UNIQUE ("join_code"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_edd8096a8de1a173dc208e610e3" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_edd8096a8de1a173dc208e610e3"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TYPE "public"."session_status_enum"`);
    }

}
