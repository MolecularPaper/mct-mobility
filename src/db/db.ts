import { MongoClient, Db } from "mongodb";
import "dotenv/config";

const MONGODB_URI = process.env.VITE_DB_URI!;
const MONGODB_DB = process.env.VITE_DB_NAME!;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
