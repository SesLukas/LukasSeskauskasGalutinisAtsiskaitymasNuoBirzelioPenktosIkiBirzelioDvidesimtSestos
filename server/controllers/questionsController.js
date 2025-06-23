import { getDb } from "../config/db.js";

const db = getDb();
const questionsCollection = db.collection("questions");

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await questionsCollection.find().toArray();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant klausimus", error: err.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const newQuestion = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    await questionsCollection.insertOne(newQuestion);
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: "Nepavyko sukurti klausimo", error: err.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const result = await questionsCollection.updateOne({ _id: id }, { $set: updatedFields });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Klausimas nerastas" });
    }
    res.status(200).json({ message: "Klausimas atnaujintas" });
  } catch (err) {
    res.status(500).json({ message: "Klaida atnaujinant klausimą", error: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await questionsCollection.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Klausimas nerastas" });
    }
    res.status(200).json({ message: "Klausimas ištrintas" });
  } catch (err) {
    res.status(500).json({ message: "Klaida trinant klausimą", error: err.message });
  }
};
export const getSingleQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await questionsCollection.findOne({ _id: id });
    if (!question) return res.status(404).json({ message: "Klausimas nerastas" });
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant klausimą", error: err.message });
  }
};