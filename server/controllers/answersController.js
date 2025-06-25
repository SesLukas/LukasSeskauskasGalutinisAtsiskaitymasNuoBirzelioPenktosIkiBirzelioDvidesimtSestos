import { getDb } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getAnswersByQuestionId = async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const answers = await db.collection("answers").aggregate([
      { $match: { question_id: id } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id", // jei user_id = _id
          as: "author"
        }
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          id: 1,
          text: 1,
          createdAt: 1,
          user_id: 1,
          edited: 1,
          author: {
            username: "$author.username"
          }
        }
      }
    ]).toArray();

    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant atsakymus", error: err.message });
  }
};

export const createAnswer = async (req, res) => {
  try {
    const db = getDb();
    const answersCollection = db.collection("answers");

    const newAnswer = {
  _id: uuidv4(),         
  id: uuidv4(),          
  question_id: req.params.id,
  user_id: req.user.id,
  text: req.body.text,
  createdAt: new Date().toISOString(),
  updatedAt: null,
  edited: false,
  likes: [],
  dislikes: []
};
    await answersCollection.insertOne(newAnswer);

    const fullAnswer = await db.collection("answers").aggregate([
      { $match: { id: newAnswer.id } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "id",
          as: "author"
        }
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          id: 1,
          text: 1,
          createdAt: 1,
          author: {
            username: "$author.username"
          }
        }
      }
    ]).toArray();

    res.status(201).json(fullAnswer[0]);

  } catch (err) {
    res.status(500).json({ message: "Nepavyko sukurti atsakymo", error: err.message });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const db = getDb();
    const answersCollection = db.collection("answers");
    const { id } = req.params;

    const answer = await answersCollection.findOne({ id });
    if (!answer) {
      return res.status(404).json({ message: "Atsakymas nerastas" });
    }

    if (answer.user_id !== req.user.id) {
      return res.status(403).json({ message: "Negalite redaguoti šio atsakymo" });
    }

    const result = await answersCollection.updateOne(
      { id },
      {
        $set: {
          text: req.body.text,
          edited: true,
          updatedAt: new Date().toISOString()
        }
      }
    );

    res.status(200).json({ message: "Atsakymas atnaujintas" });
  } catch (err) {
    res.status(500).json({ message: "Klaida atnaujinant atsakymą", error: err.message });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const db = getDb();
    const answersCollection = db.collection("answers");
    const { id } = req.params;

    const answer = await answersCollection.findOne({ id });
    if (!answer) {
      return res.status(404).json({ message: "Atsakymas nerastas" });
    }

    if (answer.user_id !== req.user.id) {
      return res.status(403).json({ message: "Negalite ištrinti šio atsakymo" });
    }

    await answersCollection.deleteOne({ id });

    res.status(200).json({ message: "Atsakymas ištrintas" });
  } catch (err) {
    res.status(500).json({ message: "Klaida trinant atsakymą", error: err.message });
  }
};