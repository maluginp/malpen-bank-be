import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddNicknameToUser1658038221541 implements MigrationInterface {

    column = new TableColumn({
        name: "nickname",
        type: "varchar",
        length: "50",
        isUnique: true,        
        isNullable: true,
    })

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', this.column)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', this.column)
    }
}
