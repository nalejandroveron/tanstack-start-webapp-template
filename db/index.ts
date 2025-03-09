import { drizzle } from 'drizzle-orm/postgres-js';

// biome-ignore lint/style/noNonNullAssertion: This should be set.
export const db = drizzle(process.env.DATABASE_URL!, {
  schema: {},
});
