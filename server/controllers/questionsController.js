import { getDb } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";


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
        $unwind: { path: "$author", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          id: 1,
          title: 1,
          description: 1,
          tags: 1,
          topics: 1,
          createdAt: 1,
          author: {
            username: "$author.username",
            _id: "$author._id"
          }
        }
      }
    ]).toArray();

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant klausimus", error: err.message });
  }
};





export const createQuestion = async (req, res) => {
  try {
    const db = getDb();
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ message: "Trūksta pavadinimo arba aprašymo" });
    }
    const { title, description, topics = [], tags = [] } = req.body;

    const newQuestion = {
      id: uuidv4(),
      title,
      description,
      topics,
      tags,
      authorId: req.user.id,
      createdAt: new Date(),
    };

    await db.collection("questions").insertOne(newQuestion);

    res.status(201).json({ message: "Klausimas sukurtas sėkmingai", question: newQuestion });
  } catch (err) {
    console.error("Klaida kuriant klausimą:", err);
    res.status(500).json({ message: "Klaida serveryje" });
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
    const { id } = req.params;

    const questions = await db.collection("questions").aggregate([
      {
        $match: { id } // čia ne `_id`, o tavo UUID "id"
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "author"
        }
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "answers",
          localField: "id",
          foreignField: "question_id",
          as: "answers"
        }
      },
      {
        $unwind: {
          path: "$answers",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "answers.user_id",
          foreignField: "_id",
          as: "answers.author"
        }
      },
      {
        $unwind: {
          path: "$answers.author",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$id",
          title: { $first: "$title" },
          description: { $first: "$description" },
          createdAt: { $first: "$createdAt" },
          topics: { $first: "$topics" },
          tags: { $first: "$tags" },
          author: { $first: "$author" },
          answers: {
            $push: {
              _id: "$answers._id",
              text: "$answers.text",
              createdAt: "$answers.createdAt",
              edited: "$answers.edited",
              author: {
                _id: "$answers.author._id",
                username: "$answers.author.username"
              }
            }
          }
        }
      }
    ]).toArray();
    console.log("Questions su autoriumi:", JSON.stringify(questions, null, 2));

    if (!questions[0]) {
      return res.status(404).json({ message: "Klausimas nerastas" });
    }

    res.status(200).json(questions[0]);
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant klausimą", error: err.message });
  }
};
