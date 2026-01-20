import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: import.meta.env.DATABASE_URL
  }
});
