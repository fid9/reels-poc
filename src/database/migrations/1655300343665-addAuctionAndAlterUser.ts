import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAuctionAndAlterUser1655300343665 implements MigrationInterface {
  name = 'addAuctionAndAlterUser1655300343665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_live" boolean NOT NULL, "current_price" integer NOT NULL, "percentage_number" integer NOT NULL, CONSTRAINT "pk_auction_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "display_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_verified" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_verified"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "display_name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    await queryRunner.query(`DROP TABLE "auction"`);
  }
}
