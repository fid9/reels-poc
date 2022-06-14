import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReelReports1655206547266 implements MigrationInterface {
  name = 'addReelReports1655206547266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reel-report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "reel_id" character varying NOT NULL, "reason" character varying NOT NULL, "description" character varying NOT NULL, "reelId" uuid, CONSTRAINT "pk_reel-report_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-report" ADD CONSTRAINT "fk_reel-report_reel_id_reel_id" FOREIGN KEY ("reelId") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reel-report" DROP CONSTRAINT "fk_reel-report_reel_id_reel_id"`,
    );
    await queryRunner.query(`DROP TABLE "reel-report"`);
  }
}
