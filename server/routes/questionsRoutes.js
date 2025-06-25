
import express from "express";
import {
  getAllQuestions,
  getSingleQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionsController.js";

const router = express.Router();


router.get("/", getAllQuestions);
router.get("/:id", getSingleQuestion);
router.post("/", createQuestion);
router.patch("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;

