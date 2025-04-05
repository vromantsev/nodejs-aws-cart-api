import { DataSource } from 'typeorm';
import { Product, CartItem, Cart } from './cart';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'rs-app-rds-instance.cfrrhg7oeu3i.eu-north-1.rds.amazonaws.com',
  port: 5432,
  username: 'rsAppUserVr',
  password: 'FromTheSh3d0w',
  database: 'rsAppDb',
  synchronize: true,
  logging: true,
  entities: [Product, CartItem, Cart],
  subscribers: [],
  migrations: [],
  ssl: {
    rejectUnauthorized: false,
  },
});

AppDataSource.initialize().catch((error) => console.log(error));
