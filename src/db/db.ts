import { MongoClient, Db } from "mongodb";
import "dotenv/config";

const MONGODB_URI = process.env.VITE_DB_URI!;
const MONGODB_DB = process.env.VITE_DB_NAME!;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
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

async function setupIndexes() {
  const { db } = await connectToDatabase();

  await db.collection("User").createIndex({ id: 1 }, { unique: true });
  await db
    .collection("Carpool")
    .createIndex({ driver_id: 1 }, { unique: true });
  await db
    .collection("Taxi")
    .createIndex({ passengers_id: 1 }, { unique: true });
}

setupIndexes();
export { connectToDatabase };
