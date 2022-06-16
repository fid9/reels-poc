import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRelationsToReels1655378733919 implements MigrationInterface {
  name = 'addRelationsToReels1655378733919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auction" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "uq_auction_user_id" UNIQUE ("user_id")`,
    );
    await queryRunner.query(`ALTER TABLE "reel" ADD "issuerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "fk_auction_user_id_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reel" ADD CONSTRAINT "fk_reel_issuer_id_user_id" FOREIGN KEY ("issuerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reel" DROP CONSTRAINT "fk_reel_issuer_id_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "fk_auction_user_id_user_id"`,
    );
    await queryRunner.query(`ALTER TABLE "reel" DROP COLUMN "issuerId"`);
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "uq_auction_user_id"`,
    );
    await queryRunner.query(`ALTER TABLE "auction" DROP COLUMN "user_id"`);
  }
}
