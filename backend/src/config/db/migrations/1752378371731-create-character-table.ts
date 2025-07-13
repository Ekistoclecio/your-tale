import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCharacterTable1752378371731 implements MigrationInterface {
    name = 'CreateCharacterTable1752378371731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "characters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "player_id" uuid NOT NULL, "attributes" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d731e05758f26b9315dac5e378" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_d8e51f020d1e8b1ec4bc1939d02" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_d8e51f020d1e8b1ec4bc1939d02"`);
        await queryRunner.query(`DROP TABLE "characters"`);
    }

}
