import 'server-only';
import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { Pool } from 'pg';
import * as relations from './drizzle/relations';
import * as schema from './drizzle/schema';

type DBSchema = typeof schema & typeof relations;

declare global {
  // eslint-disable-next-line no-var
  var __db__:
    | {
        init_promise?: Promise<void>;
        connector?: Connector | null;
        pool?: Pool | null;
        db?: NodePgDatabase<DBSchema> | null;
      }
    | undefined;
}

const thisGlobal = globalThis as typeof globalThis & {
  __db__?: {
    init_promise?: Promise<void>;
    connector?: Connector | null;
    pool?: Pool | null;
    db?: NodePgDatabase<DBSchema> | null;
  };
};

async function init() {
  const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME;
  if (!instanceConnectionName) {
    throw new Error('INSTANCE_CONNECTION_NAME not set');
  }

  const dbUser = process.env.DB_USER;
  if (!dbUser) {
    throw new Error('DB_USER not set');
  }

  const dbName = process.env.DB_NAME;
  if (!dbName) {
    throw new Error('DB_NAME not set');
  }

  const dbConnectionType = process.env.DB_CONNECTION_TYPE;
  const ipType = dbConnectionType === 'PRIMARY' ? IpAddressTypes.PUBLIC : IpAddressTypes.PRIVATE;

  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName,
    ipType,
    authType: AuthTypes.IAM,
  });

  const pool = new Pool({
    ...clientOpts,
    user: dbUser,
    database: dbName,
    max: 5,
  });

  await pool.connect();
  const dbSchema: DBSchema = { ...schema, ...relations };
  const db = drizzle({ client: pool, schema: dbSchema });
  thisGlobal.__db__ = { ...thisGlobal.__db__, connector, pool, db };
}

async function initIfNeeded() {
  if (!thisGlobal.__db__?.init_promise) {
    const promise = init();
    thisGlobal.__db__ = { ...thisGlobal.__db__, init_promise: promise };
  }
  await thisGlobal.__db__!.init_promise;
}

export async function getDb(): Promise<NodePgDatabase<DBSchema>> {
  await initIfNeeded();
  if (!thisGlobal.__db__?.db) {
    throw new Error('db not initialized');
  }
  return thisGlobal.__db__.db;
}

export async function rlsTransaction<T>(
  userId: string,
  work: (tx: NodePgDatabase<DBSchema>) => Promise<T>,
): Promise<T> {
  const db = await getDb();
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.current_user_id', ${userId}, true)`);
    return work(tx);
  });
}

export async function checkConnection(): Promise<{ ok: boolean; now?: string; error?: string }> {
  try {
    await initIfNeeded();
    const pool = thisGlobal.__db__!.pool!;
    const res = await pool.query<{ now: string }>('SELECT now()');
    return { ok: true, now: res.rows[0].now };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
