import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAuctionIssuerId1655300823935 implements MigrationInterface {
  name = 'addAuctionIssuerId1655300823935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auction" ADD "issuer_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auction" DROP COLUMN "issuer_id"`);
  }
}
