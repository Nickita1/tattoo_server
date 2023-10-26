import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUser1698322990131 implements MigrationInterface {
  name = 'AddedUser1698322990131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "brand_partner_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_3e1a3925f8ac8ef0a2ae73b72e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "gender" character varying NOT NULL, "date_of_birth" TIMESTAMP NOT NULL, "education" character varying NOT NULL, "experience" character varying NOT NULL, "contact_number" character varying NOT NULL, "contact_email" character varying NOT NULL, "style" character varying NOT NULL, CONSTRAINT "PK_ff6fbb46f0a78351950c41a5e66" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying NOT NULL, "username" character varying(500) NOT NULL, "role" character varying NOT NULL, "picture_link" character varying NOT NULL, "employee_profile_id" uuid, "brand_partner_profile_id" uuid, CONSTRAINT "REL_22166def777f72de5c89ea47f1" UNIQUE ("employee_profile_id"), CONSTRAINT "REL_fecd96c850b67458caee8ad3a0" UNIQUE ("brand_partner_profile_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_22166def777f72de5c89ea47f19" FOREIGN KEY ("employee_profile_id") REFERENCES "employee_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_fecd96c850b67458caee8ad3a02" FOREIGN KEY ("brand_partner_profile_id") REFERENCES "brand_partner_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_fecd96c850b67458caee8ad3a02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_22166def777f72de5c89ea47f19"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "employee_profile"`);
    await queryRunner.query(`DROP TABLE "brand_partner_profile"`);
  }
}
