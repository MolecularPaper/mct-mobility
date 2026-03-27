import { MongoClient, Db } from "mongodb";
import process from "process";

const uri = import.meta.env.VITE_DB_URI || "";
const client = new MongoClient(uri);
const databaseName = "mct_mobility";

let db: Db;

export async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Atlas 연결");
    db = client.db(databaseName); // 사용할 데이터베이스 이름
    return db;
  } catch (error) {
    console.error("DB 연결 에러: ", error);
    process.exit(1);
  }
}

export { db };
