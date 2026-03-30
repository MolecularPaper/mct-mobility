import { MongoClient, Db } from "mongodb";
import "dotenv/config";

const MONGODB_URI = process.env.DB_URI!;
const MONGODB_ADMIN_URI = process.env.DB_ADMIN_URI!;
const MONGODB_DB = process.env.DB_NAME!;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(uri?: string) {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri ?? MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

async function setupIndexes() {
  const { db } = await connectToDatabase(MONGODB_ADMIN_URI);

  await db.collection("User").createIndex({ id: 1 }, { unique: true });
}

setupIndexes();
export { connectToDatabase };
