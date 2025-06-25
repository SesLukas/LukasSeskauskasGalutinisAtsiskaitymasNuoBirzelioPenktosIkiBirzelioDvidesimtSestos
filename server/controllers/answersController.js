import { getDb } from "../config/db.js";


export const getAnswersByQuestionId = async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const answers = await db.collection("answers").aggregate([
      {
        $match: { question_id: id }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id", // 👈 svarbu: ne "_id", o "id", jei naudojate string ID
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
  $project: {
    _id: 1,
    text: 1,
    createdAt: 1,
    user_id: 1,
    "author.username": 1
  }
}
    ]).toArray();
    console.log("Gauti atsakymai:", JSON.stringify(answers, null, 2));

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
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: null
    };
    await answersCollection.insertOne(newAnswer);
    res.status(201).json(newAnswer);
  } catch (err) {
    res.status(500).json({ message: "Nepavyko sukurti atsakymo", error: err.message });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const db = getDb();
    const answersCollection = db.collection("answers");
    const { id } = req.params;
    const updatedFields = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    const result = await answersCollection.updateOne({ _id: id }, { $set: updatedFields });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Atsakymas nerastas" });
    }
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
    const result = await answersCollection.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Atsakymas nerastas" });
    }
    res.status(200).json({ message: "Atsakymas ištrintas" });
  } catch (err) {
    res.status(500).json({ message: "Klaida trinant atsakymą", error: err.message });
  }
};



