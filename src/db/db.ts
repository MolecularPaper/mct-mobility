import { MongoClient, Db } from "mongodb";
import process from "process";

const uri = import.meta.env.VITE_DB_URI || "";
const dbName = import.meta.env.VITE_DB_NAME || "";
const client = new MongoClient(uri);

let db: Db;

export async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Atlas 연결");
    db = client.db(dbName); // 사용할 데이터베이스 이름
    return db;
  } catch (error) {
    console.error("DB 연결 에러: ", error);
    process.exit(1);
  }
}

export { db };
