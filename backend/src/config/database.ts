import 'dotenv/config';
import { Sequelize } from 'sequelize';

const useSsl = process.env.DB_SSL?.toLowerCase() === 'true';
const commonOptions = {
  dialect: 'postgres' as const,
  logging: false,
  define: { underscored: true, timestamps: true },
  dialectOptions: useSsl
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
};

export const sequelize = new Sequelize(
  process.env.DB_NAME ?? 'postgres',
  process.env.DB_USER ?? 'postgres',
  process.env.DB_PASSWORD ?? 'postgres',
  {
    ...commonOptions,
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
  },
);

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('Banco PostgreSQL conectado e tabela caminhoes sincronizada.');
}
