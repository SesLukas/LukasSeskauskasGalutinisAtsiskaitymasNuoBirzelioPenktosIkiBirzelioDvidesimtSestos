import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getDb } from "../config/db.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const db = getDb();
    const usersCollection = db.collection("users");

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
    const db = getDb();
    const usersCollection = db.collection("users");

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

    res.status(200).json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Prisijungimo klaida", error: err.message });
  }
};
