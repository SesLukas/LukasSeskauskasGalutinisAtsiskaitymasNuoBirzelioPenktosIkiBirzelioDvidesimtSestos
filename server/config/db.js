const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log(" MongoDB prijungta");
  } catch (err) {
    console.error(" Nepavyko prisijungti prie DB:", err);
    process.exit(1);
  }
}

function getDb() {
  if (!db) throw new Error("DB dar neprijungta. Kviesk connectToDatabase() pirma.");
  return db;
}

module.exports = {
  connectToDatabase,
  getDb
};
