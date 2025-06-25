import { getDb } from "../config/db.js";


export const getAllQuestions = async (req, res) => {
  try {
    const db = getDb(); 
    const questions = await db.collection("questions").aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "author"
        }
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    res.status(200).json(questions);
  } catch (err) {
    console.error("Klaida gaunant klausimus:", err);
    res.status(500).json({ message: "Klaida serveryje" });
  }
};



export const createQuestion = async (req, res) => {
  try {
    const db = getDb();
    const questionsCollection = db.collection("questions");

    const newQuestion = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      likes: [],
      dislikes: [],
    };

    await questionsCollection.insertOne(newQuestion);
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: "Nepavyko sukurti klausimo", error: err.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const db = getDb();
    const questionsCollection = db.collection("questions");
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
    const db = getDb();
    const questionsCollection = db.collection("questions");
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
    const db = getDb();
    const questionsCollection = db.collection("questions");
    const answersCollection = db.collection("answers");
    const usersCollection = db.collection("users");

    const { id } = req.params;

    // Klausimas su autoriumi
    const question = await questionsCollection.aggregate([
      {
        $match: { _id: id }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "id",
          as: "author"
        }
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    if (!question[0]) {
      return res.status(404).json({ message: "Klausimas nerastas" });
    }

    // Atsakymai su jų autoriais
    const answers = await answersCollection.aggregate([
      {
        $match: { question_id: id }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "id",
          as: "author"
        }
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    res.status(200).json({
      ...question[0],
      answers
    });
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant klausimą", error: err.message });
  }
};
