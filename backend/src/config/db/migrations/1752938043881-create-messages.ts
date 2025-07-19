import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMessages1752938043881 implements MigrationInterface {
    name = 'CreateMessages1752938043881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."messages_type_enum" AS ENUM('user', 'ai', 'system')`);
        await queryRunner.query(`CREATE TYPE "public"."messages_chat_type_enum" AS ENUM('general', 'master')`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sender_id" uuid NOT NULL, "session_id" uuid NOT NULL, "content" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."messages_type_enum" NOT NULL DEFAULT 'user', "chat_type" "public"."messages_chat_type_enum" NOT NULL DEFAULT 'general', "reply_to" uuid, "metadata" json, "is_deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c4bc9f31ead76d604c9ebc12c6" ON "messages" ("session_id", "chat_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_9dbbbf0037394a22b075d8ed5c" ON "messages" ("session_id", "timestamp") `);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_ff71b7760071ed9caba7f02beb4" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_5c253c352f5150e6ccf1e1ec374" FOREIGN KEY ("reply_to") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_5c253c352f5150e6ccf1e1ec374"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_ff71b7760071ed9caba7f02beb4"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9dbbbf0037394a22b075d8ed5c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c4bc9f31ead76d604c9ebc12c6"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE "public"."messages_chat_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."messages_type_enum"`);
    }

}
