import 'reflect-metadata'
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || "8866"),
  username: process.env.DB_USERNAME || 'test',
  password: process.env.DB_PASSWORD || 'test',
  database: process.env.DB_BASE || 'bank',
  synchronize: true,
  logging: true,
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});

// AppDataSource.initialize()
//     .then(() => {
//         console.log("Data Source has been initialized!")
//     })
//     .catch((err) => {
//         console.error("Error during Data Source initialization", err)
//     })
 