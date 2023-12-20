import { appRouter } from "../src/trpc/appRouter.js";
import { TrpcContext } from "../src/trpc/trpcContext.js";
import { createAuth, createOAuths } from "../src/auth/auth.js";
import { connectToDb, migrationsFolder } from "../src/db/db.js";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../src/env.js";
import * as schema from "../src/db/schema/index.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
// Set up separate tsconfig for tests and test utils.
import { TestContext } from "vitest";
import { afterEach, beforeAll, beforeEach } from "vitest";

// New test database runs in the same postgres server
export const createTestDatabase = async (name: string): Promise<pg.Pool> => {
  // Connect to local development database to create a new test database
  const { dbPool: applicationDatabase } = await connectToDb();
  await applicationDatabase.query(`CREATE DATABASE ${name}`);
  return new pg.Pool({
    database: name,
    port: 5432,
    host: "localhost",
    user: "user",
    password: "password",
  });
};

export const dropTestDatabase = async (name: string) => {
  // Connect to other database to be able to drop the testing one
  const { dbPool: applicationDatabase } = await connectToDb();
  await applicationDatabase.query(`DROP DATABASE IF EXISTS ${name}`);
};

export const createContext = async (dbPool: pg.Pool): Promise<TrpcContext> => {
  // Create database

  const db = drizzle(dbPool, { logger: env.LOG_TEST_DATABASE, schema });
  await migrate(db, { migrationsFolder });

  const auth = createAuth(dbPool);
  const oAuths = createOAuths(auth);
  return {
    db,
    auth,
    oAuths,
    clientProtocol: "ws",
    connectionContext: {},
  };
};

export const createCaller = async (dbPool: pg.Pool) => {
  return appRouter.createCaller(await createContext(dbPool));
};

export type Caller = ReturnType<(typeof appRouter)["createCaller"]>;

export const testLifecycle = {
  // when tests fail, afterEach is not called and the database is not cleaned
  beforeAll: async (testDatabaseName: string) =>
    await dropTestDatabase(testDatabaseName),
  beforeEach: async (ctx: TestContext, testDatabaseName: string) => {
    const dbPool = await createTestDatabase(testDatabaseName);
    const caller = await createCaller(dbPool);
    ctx.dbPool = dbPool;
    return { caller };
  },
  afterEach: async (ctx: TestContext, testDatabaseName: string) => {
    ctx.dbPool?.end();
    ctx.dbPool = undefined;
    await dropTestDatabase(testDatabaseName);
  },
};

const appName = "talkdash";

export const setupTestDatabaseLifecycle = (suiteName: string) => {
  const testDatabaseName =
    `${appName}_integration_test_${suiteName}`.toLowerCase();
  const ref = { caller: undefined as unknown as Caller };

  beforeAll(async () => {
    await testLifecycle.beforeAll(testDatabaseName);
  });

  // TODO try remove TestContext
  beforeEach(async (ctx: TestContext) => {
    const { caller } = await testLifecycle.beforeEach(ctx, testDatabaseName);
    ref.caller = caller;
  });

  afterEach(async (ctx: TestContext) => {
    await testLifecycle.afterEach(ctx, testDatabaseName);
  });

  return ref;
};
