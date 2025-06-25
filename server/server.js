import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import questionRoutes from "./routes/questionsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import likesRoutes from "./routes/likesRoutes.js";
import answersroutes from "./routes/answersroutes.js";
import questionsFilterRoutes from "./routes/questionsFilterRoutes.js";
dotenv.config();

import { connectToDatabase } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use("/questions", questionRoutes);
app.use(userRoutes);
app.use(answersroutes);
app.use("/likes", likesRoutes);
app.use("/filtered-questions", questionsFilterRoutes);

app.get("/", (req, res) => res.send("Sveiki atvykę!"));

connectToDatabase().then(() => {
  app.listen(PORT, () => console.log(` Serveris veikia http://localhost:${PORT}`));
});

