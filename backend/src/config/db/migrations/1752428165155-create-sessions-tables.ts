import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessionsTables1752428165155 implements MigrationInterface {
    name = 'CreateSessionsTables1752428165155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session_players" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "session_id" uuid NOT NULL, "player_id" uuid NOT NULL, "character_id" uuid, "is_master" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_553400b7551b527e9452e67f5ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "has_ai_master" boolean NOT NULL DEFAULT false, "master_id" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session_players" ADD CONSTRAINT "FK_6611d88b21374f0d4ec3bea0afa" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session_players" ADD CONSTRAINT "FK_efeb42fd6ed37f7f480ed3b7de1" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session_players" ADD CONSTRAINT "FK_cf20c3cf5b08064a4df667a42bb" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_players" DROP CONSTRAINT "FK_cf20c3cf5b08064a4df667a42bb"`);
        await queryRunner.query(`ALTER TABLE "session_players" DROP CONSTRAINT "FK_efeb42fd6ed37f7f480ed3b7de1"`);
        await queryRunner.query(`ALTER TABLE "session_players" DROP CONSTRAINT "FK_6611d88b21374f0d4ec3bea0afa"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "session_players"`);
    }

}
