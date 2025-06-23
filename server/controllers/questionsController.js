import { getDb } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function getAllQuestions(req, res) {
  try {
    const db = getDb();
    const questions = await db.collection("questions").find().toArray();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant klausimus" });
  }
}

export async function getSingleQuestion(req, res) {
  try {
    const db = getDb();
    const question = await db
      .collection("questions")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!question) return res.status(404).json({ message: "Nerasta" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant klausimą" });
  }
}

export async function createQuestion(req, res) {
  try {
    const db = getDb();
    const newQuestion = {
      text: req.body.text,
      authorId: req.body.authorId,
      createdAt: new Date(),
    };
    const result = await db.collection("questions").insertOne(newQuestion);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: "Klaida kuriant klausimą" });
  }
}

export async function updateQuestion(req, res) {
  try {
    const db = getDb();
    const result = await db.collection("questions").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { text: req.body.text } }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Klaida atnaujinant klausimą" });
  }
}

export async function deleteQuestion(req, res) {
  try {
    const db = getDb();
    const result = await db
      .collection("questions")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Klaida trinant klausimą" });
  }
}
