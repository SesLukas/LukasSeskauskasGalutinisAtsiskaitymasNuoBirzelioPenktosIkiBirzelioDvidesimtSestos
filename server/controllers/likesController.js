// controllers/likesController.js
import { getDb } from "../config/db.js";

export const likeQuestion = async (req, res) => {
  try {
    const db = getDb();
    const questions = db.collection("questions");
    const { id } = req.params;
    const userId = req.user.id;

    const result = await questions.updateOne(
      { _id: id },
      { $addToSet: { likes: userId }, $pull: { dislikes: userId } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Klausimas nerastas" });

    res.status(200).json({ message: "👍 Like pridėtas" });
  } catch (err) {
    res.status(500).json({ message: "Klaida žymint like", error: err.message });
  }
};

export const dislikeQuestion = async (req, res) => {
  try {
    const db = getDb();
    const questions = db.collection("questions");
    const { id } = req.params;
    const userId = req.user.id;

    const result = await questions.updateOne(
      { _id: id },
      { $addToSet: { dislikes: userId }, $pull: { likes: userId } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Klausimas nerastas" });

    res.status(200).json({ message: "👎 Dislike pridėtas" });
  } catch (err) {
    res.status(500).json({ message: "Klaida žymint dislike", error: err.message });
  }
};

export const removeLike = async (req, res) => {
  try {
    const db = getDb();
    const questions = db.collection("questions");
    const { id } = req.params;
    const userId = req.user.id;

    const result = await questions.updateOne(
      { _id: id },
      { $pull: { likes: userId } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Klausimas nerastas" });

    res.status(200).json({ message: "👍 Like pašalintas" });
  } catch (err) {
    res.status(500).json({ message: "Klaida šalinant like", error: err.message });
  }
};

export const removeDislike = async (req, res) => {
  try {
    const db = getDb();
    const questions = db.collection("questions");
    const { id } = req.params;
    const userId = req.user.id;

    const result = await questions.updateOne(
      { _id: id },
      { $pull: { dislikes: userId } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Klausimas nerastas" });

    res.status(200).json({ message: "👎 Dislike pašalintas" });
  } catch (err) {
    res.status(500).json({ message: "Klaida šalinant dislike", error: err.message });
  }
};
