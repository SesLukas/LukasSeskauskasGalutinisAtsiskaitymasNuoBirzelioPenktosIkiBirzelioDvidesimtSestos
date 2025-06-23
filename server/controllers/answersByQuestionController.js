import { getDb } from "../config/db.js";

export const getAnswersByQuestionId = async (req, res) => {
  try {
    const db = getDb();
    const answersCollection = db.collection("answers");
    const { id } = req.params;
    const answers = await answersCollection.find({ questionId: id }).toArray();
    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant atsakymus", error: err.message });
  }
};