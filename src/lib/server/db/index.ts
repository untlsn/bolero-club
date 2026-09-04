import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
  url: env.DATABASE_URL || 'file:local.db',
  authToken: env.DATABASE_AUTH_TOKEN || undefined
});

export const db = drizzle(client);
