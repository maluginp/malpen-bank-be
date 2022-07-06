import 'reflect-metadata'
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 8866,
  username: 'test',
  password: 'test',
  database: 'bank',
  synchronize: true,
  logging: true,
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});

// AppDataSource.initialize()
//     .then(() => {
//         console.log("Data Source has been initialized!")
//     })
//     .catch((err) => {
//         console.error("Error during Data Source initialization", err)
//     })
 