import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddDefaultFlagToWallet1658038258475 implements MigrationInterface {

    column = new TableColumn({
        name: "is_default",
        type: "boolean",
        default: false
    })

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('wallets', this.column)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('wallets', this.column)
    }

}
