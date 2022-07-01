import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1656665190112 implements MigrationInterface {
  name = 'migrations1656665190112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_live" boolean NOT NULL, "issuer_id" character varying NOT NULL, "current_price" integer NOT NULL, "percentage_number" integer NOT NULL, "user_id" uuid, CONSTRAINT "rel_auction_user_id" UNIQUE ("user_id"), CONSTRAINT "pk_auction_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" character varying NOT NULL, "username" character varying NOT NULL, "display_name" character varying NOT NULL, "is_verified" boolean NOT NULL, CONSTRAINT "pk_user_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reel_status_enum" AS ENUM('APPROVED', 'SUBMITTED', 'NEEDS_CHANGES')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reel_upload_status_enum" AS ENUM('SUBMITTED', 'IN_PROGRESS', 'SUCCESS', 'ERROR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "issuer_id" uuid NOT NULL, "reel_id" character varying NOT NULL, "job_id" character varying NOT NULL, "status" "public"."reel_status_enum" NOT NULL DEFAULT 'SUBMITTED', "upload_status" "public"."reel_upload_status_enum" NOT NULL DEFAULT 'SUBMITTED', "is_visible" boolean NOT NULL DEFAULT true, "issuerId" uuid, CONSTRAINT "pk_reel_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel-like-count" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "reel_id" character varying NOT NULL, "count" integer NOT NULL, "reelId" uuid, CONSTRAINT "rel_reel-like-count_reel_id" UNIQUE ("reelId"), CONSTRAINT "pk_reel-like-count_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel-report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "reel_id" character varying NOT NULL, "reason" character varying NOT NULL, "description" character varying NOT NULL, "reelId" uuid, CONSTRAINT "pk_reel-report_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel-view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "reel_id" character varying NOT NULL, "duration" integer NOT NULL, "view_status" character varying NOT NULL, "reelId" uuid, CONSTRAINT "pk_reel-view_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel-like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "reel_id" character varying NOT NULL, "reelId" uuid, CONSTRAINT "pk_reel-like_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "fk_auction_user_id_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel" ADD CONSTRAINT "fk_reel_issuer_id_user_id" FOREIGN KEY ("issuerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like-count" ADD CONSTRAINT "fk_reel-like-count_reel_id_reel_id" FOREIGN KEY ("reelId") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-report" ADD CONSTRAINT "fk_reel-report_reel_id_reel_id" FOREIGN KEY ("reelId") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-view" ADD CONSTRAINT "fk_reel-view_reel_id_reel_id" FOREIGN KEY ("reelId") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like" ADD CONSTRAINT "fk_reel-like_reel_id_reel_id" FOREIGN KEY ("reelId") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reel-like" DROP CONSTRAINT "fk_reel-like_reel_id_reel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-view" DROP CONSTRAINT "fk_reel-view_reel_id_reel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-report" DROP CONSTRAINT "fk_reel-report_reel_id_reel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like-count" DROP CONSTRAINT "fk_reel-like-count_reel_id_reel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel" DROP CONSTRAINT "fk_reel_issuer_id_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "fk_auction_user_id_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "reel-like"`);
    await queryRunner.query(`DROP TABLE "reel-view"`);
    await queryRunner.query(`DROP TABLE "reel-report"`);
    await queryRunner.query(`DROP TABLE "reel-like-count"`);
    await queryRunner.query(`DROP TABLE "reel"`);
    await queryRunner.query(`DROP TYPE "public"."reel_upload_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."reel_status_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "auction"`);
  }
}
