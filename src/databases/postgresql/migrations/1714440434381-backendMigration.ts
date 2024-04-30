import { MigrationInterface, QueryRunner } from "typeorm";

export class BackendMigration1714440434381 implements MigrationInterface {
    name = 'BackendMigration1714440434381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "article" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "article_url" character varying NOT NULL, "article_summary" character varying NOT NULL, "submission_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_40808690eb7b915046558c0f81" ON "article" ("id") `);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "message_date" TIMESTAMP NOT NULL, "is_user" boolean NOT NULL, "chat_id" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ba01f0a3e0123651915008bc57" ON "message" ("id") `);
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "article_id" uuid, CONSTRAINT "REL_278ea16857f7324b7380a62d8c" UNIQUE ("article_id"), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9d0b2ba74336710fd31154738a" ON "chat" ("id") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userName" character varying(30) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(60) NOT NULL, "refreshToken" text, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_859ffc7f95098efb4d84d50c632" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_15d83eb496fd7bec7368b30dbf3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_278ea16857f7324b7380a62d8ca" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_278ea16857f7324b7380a62d8ca"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_15d83eb496fd7bec7368b30dbf3"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_859ffc7f95098efb4d84d50c632"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cace4a159ff9f2512dd4237376"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d0b2ba74336710fd31154738a"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ba01f0a3e0123651915008bc57"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40808690eb7b915046558c0f81"`);
        await queryRunner.query(`DROP TABLE "article"`);
    }

}
