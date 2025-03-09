import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './.drizzle',
  schema: './db',
  dialect: 'postgresql',
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: This should be set, otherwise script will fail.
    url: process.env.DATABASE_URL!,
  },
});
