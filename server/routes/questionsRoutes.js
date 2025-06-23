import express from "express";
import {
  getAllQuestions,
  getSingleQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionsController.js";

const router = express.Router();

router.get("/questions", getAllQuestions);
router.get("/questions/:id", getSingleQuestion);
router.post("/questions", createQuestion);
router.patch("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
