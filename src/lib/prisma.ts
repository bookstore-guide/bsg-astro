import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../prisma/generated/prisma/client';

const connection = {
  host: import.meta.env.DATABASE_HOST,
  port: parseInt(import.meta.env.DATABASE_PORT),
  user: import.meta.env.DATABASE_USER,
  password: import.meta.env.DATABASE_PASSWORD,
  database: import.meta.env.DATABASE_NAME,
  connectionLimit: 1,
  ssl: { rejectUnauthorized: false }
};

const adapter = new PrismaMariaDb(connection);

const prisma = new PrismaClient({
  adapter
});

export default prisma;
