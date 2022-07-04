import { MigrationInterface, QueryRunner } from 'typeorm';

export class initMigrations1656924274593 implements MigrationInterface {
  name = 'initMigrations1656924274593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" character varying NOT NULL, "username" character varying NOT NULL, "display_name" character varying NOT NULL, "is_verified" boolean NOT NULL, CONSTRAINT "uq_user_username" UNIQUE ("username"), CONSTRAINT "pk_user_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_live" boolean NOT NULL, "issuer_id" character varying NOT NULL, "current_price" integer NOT NULL, "percentage_number" integer NOT NULL, "user_id" uuid, CONSTRAINT "rel_auction_user_id" UNIQUE ("user_id"), CONSTRAINT "pk_auction_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reel_status_enum" AS ENUM('UPLOAD_SUBMITTED', 'UPLOAD_IN_PROGRESS', 'UPLOAD_ERROR', 'SUBMITTED', 'APPROVED', 'NEEDS_CHANGES')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "issuer_id" uuid NOT NULL, "object_id" character varying NOT NULL, "job_id" character varying NOT NULL, "status" "public"."reel_status_enum" NOT NULL DEFAULT 'UPLOAD_SUBMITTED', "is_visible" boolean NOT NULL DEFAULT true, "like_count" integer NOT NULL DEFAULT '0', CONSTRAINT "uq_reel_object_id" UNIQUE ("object_id"), CONSTRAINT "uq_reel_job_id" UNIQUE ("job_id"), CONSTRAINT "pk_reel_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel-like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "reel_id" uuid NOT NULL, CONSTRAINT "pk_reel-like_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel-report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "reel_id" uuid NOT NULL, "reason" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "pk_reel-report_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reel-view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "reel_id" uuid NOT NULL, "duration" integer NOT NULL, "view_status" character varying NOT NULL, CONSTRAINT "pk_reel-view_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "fk_auction_user_id_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel" ADD CONSTRAINT "fk_reel_issuer_id_user_id" FOREIGN KEY ("issuer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like" ADD CONSTRAINT "fk_reel-like_reel_id_reel_id" FOREIGN KEY ("reel_id") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like" ADD CONSTRAINT "fk_reel-like_user_id_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-report" ADD CONSTRAINT "fk_reel-report_reel_id_reel_id" FOREIGN KEY ("reel_id") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-view" ADD CONSTRAINT "fk_reel-view_reel_id_reel_id" FOREIGN KEY ("reel_id") REFERENCES "reel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reel-view" DROP CONSTRAINT "fk_reel-view_reel_id_reel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-report" DROP CONSTRAINT "fk_reel-report_reel_id_reel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like" DROP CONSTRAINT "fk_reel-like_user_id_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel-like" DROP CONSTRAINT "fk_reel-like_reel_id_reel_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel" DROP CONSTRAINT "fk_reel_issuer_id_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "fk_auction_user_id_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "reel-view"`);
    await queryRunner.query(`DROP TABLE "reel-report"`);
    await queryRunner.query(`DROP TABLE "reel-like"`);
    await queryRunner.query(`DROP TABLE "reel"`);
    await queryRunner.query(`DROP TYPE "public"."reel_status_enum"`);
    await queryRunner.query(`DROP TABLE "auction"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
