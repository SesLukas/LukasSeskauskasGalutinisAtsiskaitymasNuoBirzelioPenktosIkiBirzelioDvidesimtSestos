import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();
await connectToDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveris veikia: http://localhost:${PORT}`);
  });
});

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

