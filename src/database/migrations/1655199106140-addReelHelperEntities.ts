import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReelHelperEntities1655199106140 implements MigrationInterface {
  name = 'addReelHelperEntities1655199106140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reel-like-count" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "reel_id" character varying NOT NULL, "count" integer NOT NULL, "reelId" uuid, CONSTRAINT "rel_reel-like-count_reel_id" UNIQUE ("reelId"), CONSTRAINT "pk_reel-like-count_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel-like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "reel_id" character varying NOT NULL, "reelId" uuid, CONSTRAINT "pk_reel-like_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel-view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "reel_id" character varying NOT NULL, "duration" integer NOT NULL, "view_status" character varying NOT NULL, "reelId" uuid, CONSTRAINT "pk_reel-view_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like-count" ADD CONSTRAINT "fk_reel-like-count_reel_id_reel_id" FOREIGN KEY ("reelId") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like" ADD CONSTRAINT "fk_reel-like_reel_id_reel_id" FOREIGN KEY ("reelId") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-view" ADD CONSTRAINT "fk_reel-view_reel_id_reel_id" FOREIGN KEY ("reelId") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reel-view" DROP CONSTRAINT "fk_reel-view_reel_id_reel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like" DROP CONSTRAINT "fk_reel-like_reel_id_reel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like-count" DROP CONSTRAINT "fk_reel-like-count_reel_id_reel_id"`,
    );
    await queryRunner.query(`DROP TABLE "reel-view"`);
    await queryRunner.query(`DROP TABLE "reel-like"`);
    await queryRunner.query(`DROP TABLE "reel-like-count"`);
  }
}
