import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectToDatabase } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);

app.get("/", (req, res) => res.send("Sveiki atvykę!"));

connectToDatabase().then(() => {
  app.listen(PORT, () => console.log(` Serveris veikia http://localhost:${PORT}`));
});

