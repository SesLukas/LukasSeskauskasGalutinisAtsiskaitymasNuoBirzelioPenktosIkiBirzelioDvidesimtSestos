import { connectToDatabase } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const db = await connectToDatabase();
const usersCollection = db.collection("users");


export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const db = getDb();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Vartotojas nerastas" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Neteisingas slaptažodis" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(" Login klaida:", err);
    res.status(500).json({ message: "Vidinė serverio klaida" });
  }}