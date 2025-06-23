import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();                                 

const client = new MongoClient(process.env.MONGODB_URI);
let db;

export async function connectToDatabase() {
  if (db) return db;                            
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log(" Prisijungta prie MongoDB");
  return db;
}

export function getDb() {
  if (!db) throw new Error("DB neprijungta – kviesk connectToDatabase()");
  return db;
}