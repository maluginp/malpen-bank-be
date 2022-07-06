import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterCodeColumnToUser1657652000609 implements MigrationInterface {

    column = new TableColumn({
        name: "code",
        type: "varchar",
        length: "100",
        isNullable: true,
    })

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', this.column)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', this.column)
    }

}
