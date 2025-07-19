import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustSessionsRelations1752796588847 implements MigrationInterface {
    name = 'AdjustSessionsRelations1752796588847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."session_members_role_enum" AS ENUM('player', 'spectator', 'master')`);
        await queryRunner.query(`CREATE TYPE "public"."session_members_status_enum" AS ENUM('pending', 'active', 'inactive', 'banned')`);
        await queryRunner.query(`CREATE TABLE "session_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionId" uuid NOT NULL, "userId" uuid NOT NULL, "role" "public"."session_members_role_enum" NOT NULL DEFAULT 'player', "status" "public"."session_members_status_enum" NOT NULL DEFAULT 'active', "joined_at" TIMESTAMP, "left_at" TIMESTAMP, "metadata" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7942988f66b4289c657f3a8f165" UNIQUE ("sessionId", "userId"), CONSTRAINT "PK_0e39b3b3d90a8cfebd99c59ad29" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session_members" ADD CONSTRAINT "FK_e752cb8bb36ce18bfadf6d70400" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session_members" ADD CONSTRAINT "FK_647e53b35105d0652a091b17b9b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_members" DROP CONSTRAINT "FK_647e53b35105d0652a091b17b9b"`);
        await queryRunner.query(`ALTER TABLE "session_members" DROP CONSTRAINT "FK_e752cb8bb36ce18bfadf6d70400"`);
        await queryRunner.query(`DROP TABLE "session_members"`);
        await queryRunner.query(`DROP TYPE "public"."session_members_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."session_members_role_enum"`);
    }

}
