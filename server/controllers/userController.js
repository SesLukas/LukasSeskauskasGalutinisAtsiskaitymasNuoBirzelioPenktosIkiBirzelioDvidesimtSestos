import { getDb } from "../config/db.js";

export const getCurrentUser = async (req, res) => {
  try {
    const db = getDb();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: "Vartotojas nerastas" });
    }

    res.status(200).json({
      username: user.username,
      id: user._id, 
    });
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant vartotojo duomenis", error: err.message });
  }
};


export const updateCurrentUser = async (req, res) => {
  try {
    const db = getDb();
    const usersCollection = db.collection("users");
    const updatedFields = req.body;
    const result = await usersCollection.updateOne(
      { _id: req.user.id },
      { $set: updatedFields }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Vartotojas nerastas" });
    }
    res.status(200).json({ message: "Vartotojo duomenys atnaujinti" });
  } catch (err) {
    res.status(500).json({ message: "Klaida atnaujinant vartotojo duomenis", error: err.message });
  }
};
