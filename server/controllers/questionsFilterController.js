import { getDb } from "../config/db.js";

export const getAllQuestions = async (req, res) => {
  try {
    const db = getDb();
    const questionsCollection = db.collection("questions");

    const {
      sort,
      filter,
      tag,
      topic,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // 🔍 Filtravimas pagal atsakymus
    if (filter === "answered") {
      query.answerCount = { $gt: 0 };
    } else if (filter === "unanswered") {
      query.answerCount = { $eq: 0 };
    }

    // 🔍 Filtravimas pagal tag'ą
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // 🔍 Filtravimas pagal temą (topic)
    if (topic) {
      query.topic = topic;
    }

    // 🔍 Paieška pagal pavadinimą
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // 🔃 Rikiavimas
    const sortOptions = {};
    if (sort === "date_asc") sortOptions.createdAt = 1;
    else if (sort === "date_desc") sortOptions.createdAt = -1;
    else if (sort === "answers_asc") sortOptions.answerCount = 1;
    else if (sort === "answers_desc") sortOptions.answerCount = -1;

    // 📄 Puslapiavimas
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const lim = parseInt(limit);

    // 🔎 Užklausa
    const questions = await questionsCollection
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(lim)
      .toArray();

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({
      message: "Klaida gaunant klausimus",
      error: err.message
    });
  }
};
