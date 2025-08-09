import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionHistoryFields1754681489306 implements MigrationInterface {
    name = 'AddSessionHistoryFields1754681489306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" ADD "history_theme" character varying`);
        await queryRunner.query(`ALTER TABLE "session" ADD "history_description" character varying`);
        await queryRunner.query(`ALTER TABLE "session" ADD "narrative_style" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "narrative_style"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "history_description"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "history_theme"`);
    }

}
