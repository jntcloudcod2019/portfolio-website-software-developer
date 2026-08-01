import { MongoClient, ServerApiVersion, Db } from 'mongodb';

const DATABASE_URL = "mongodb+srv://j1997silva_db_user:C9cqCcYxgL1jx6R2@cluster0.c7myaex.mongodb.net/?appName=Cluster0";

const globalForMongo = globalThis as unknown as { client: MongoClient | undefined };

function getClient() {
  if (!globalForMongo.client) {
    globalForMongo.client = new MongoClient(DATABASE_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  return globalForMongo.client;
}

export async function getDb(): Promise<Db> {
  const client = getClient();
  await client.connect();
  return client.db('portfolio_analytics');
}
