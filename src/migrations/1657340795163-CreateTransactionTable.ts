import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateTransactionTable1657340795163 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'transactions',
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isGenerated: true,
                },
                {
                    name: "signature",
                    type: "varchar",
                },
                {
                    name: "sender_id",
                    type: "int",
                },
                {
                    name: "sender_address",
                    type: "varchar"
                },
                {
                    name: "receiver_id",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "receiver_address",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "amount",
                    type: "int"
                },
                {
                    name: "status",
                    type: "int",
                },
                {
                    name: "operation",
                    type: "int"
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                    isNullable: false,
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()',
                    isNullable: false,
                },
                {
                    name: 'deleted_at',
                    type: 'timestamp',
                    isNullable: true
                }
            ]
        }))

        await queryRunner.createForeignKey('transactions', new TableForeignKey({
            columnNames: ["sender_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
        }));

        await queryRunner.createForeignKey('transactions', new TableForeignKey({
            columnNames: ["receiver_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const walletTable = await queryRunner.getTable('transactions')
        for (const fk of walletTable.foreignKeys) {
            await queryRunner.dropForeignKey('transactions', fk)
        }
        await queryRunner.dropTable('transactions')
    }

}
