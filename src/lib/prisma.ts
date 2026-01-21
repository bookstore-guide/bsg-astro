import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../prisma/generated/prisma/client';

const connection = {
  host: import.meta.env.DATABASE_HOST,
  port: parseInt(import.meta.env.DATABASE_PORT),
  user: import.meta.env.DATABASE_USER,
  password: import.meta.env.DATABASE_PASSWORD,
  database: import.meta.env.DATABASE_NAME,
  logger: {
    network: (info: unknown) => {
      console.log('PrismaAdapterNetwork', info);
    },
    query: (info: unknown) => {
      console.log('PrismaAdapterQuery', info);
    },
    error: (error: unknown) => {
      console.error('PrismaAdapterError', error);
    },
    warning: (info: unknown) => {
      console.warn('PrismaAdapterWarning', info);
    }
  }
};

console.error(connection);

const adapter = new PrismaMariaDb(connection);

const prisma = new PrismaClient({
  adapter
});

export default prisma;
