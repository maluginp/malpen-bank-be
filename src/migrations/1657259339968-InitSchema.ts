import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class InitSchema1657259339968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isGenerated: true,
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true,
                },
                {
                    name: "password",
                    type: "varchar",
                },
                {
                    name: "status",
                    type: "int",
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

        }), true)

        // Create wallet table
        await queryRunner.createTable(new Table({
            name: 'wallets',
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isGenerated: true,
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "address",
                    type: "varchar",
                },
                {
                    name: "private_key",
                    type: "varchar",
                },
                {
                    name: "user_id",
                    type: "int",
                },
                {
                    name: "status",
                    type: "int",
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
        }), true)

        await queryRunner.createForeignKey('wallets', new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const walletTable = await queryRunner.getTable('wallets')
        for (const fk of walletTable.foreignKeys) {
            await queryRunner.dropForeignKey('wallets', fk)
        }
        await queryRunner.dropTable('wallets')


        await queryRunner.dropTable('users')
    }

}
