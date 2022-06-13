import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDeleteDates1646586746786 implements MigrationInterface {
  name = 'addDeleteDates1646586746786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flower_genus" ADD "deleted_date" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "flower" ADD "deleted_date" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "flower" DROP COLUMN "deleted_date"`);
    await queryRunner.query(
      `ALTER TABLE "flower_genus" DROP COLUMN "deleted_date"`,
    );
  }
}
