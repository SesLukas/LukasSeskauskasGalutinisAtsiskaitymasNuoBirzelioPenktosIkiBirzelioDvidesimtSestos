import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);
let db;

async function start() {
  try {
    await client.connect();
    db = client.db();
    console.log(" Prisijungta prie MongoDB");

    app.get("/", (req, res) => {
      res.send("Sveiki atvykę į forumo backend!");
    });

    app.listen(PORT, () => {
      console.log(`Serveris veikia http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(" Nepavyko prisijungti prie DB:", err);
  }
}

start();

