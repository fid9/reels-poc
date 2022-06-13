import { MigrationInterface, QueryRunner } from 'typeorm';

export class flower1616156849967 implements MigrationInterface {
  name = 'flower1616156849967';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "flower" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "genus_id" uuid NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, CONSTRAINT "pk_flower_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "flower_genus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, CONSTRAINT "uq_flower_genus_name" UNIQUE ("name"), CONSTRAINT "pk_flower_genus_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "flower" ADD CONSTRAINT "fk_flower_genus_id_flower_genus_id" FOREIGN KEY ("genus_id") REFERENCES "flower_genus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flower" DROP CONSTRAINT "fk_flower_genus_id_flower_genus_id"`,
    );
    await queryRunner.query(`DROP TABLE "flower_genus"`);
    await queryRunner.query(`DROP TABLE "flower"`);
  }
}
