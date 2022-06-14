import {MigrationInterface, QueryRunner} from "typeorm";

export class createReelEntity1655129147771 implements MigrationInterface {
    name = 'createReelEntity1655129147771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "issuer_id" uuid NOT NULL, "reel_id" character varying NOT NULL, CONSTRAINT "pk_reel_id" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reel"`);
    }

}
