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
  export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Toks vartotojas jau egzistuoja" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
    };

    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "Registracija sėkminga" });
  } catch (err) {
    res.status(500).json({ message: "Registracijos klaida", error: err.message });
  }
};
  export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Neteisingas prisijungimo vardas arba slaptažodis" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Neteisingas prisijungimo vardas arba slaptažodis" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Prisijungimo klaida", error: err.message });
  }
};