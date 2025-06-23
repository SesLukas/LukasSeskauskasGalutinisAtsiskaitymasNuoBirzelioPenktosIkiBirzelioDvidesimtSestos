import express from "express";
import {
  getAnswersByQuestionId,
  createAnswer,
  updateAnswer,
  deleteAnswer
} from "../controllers/answerController.js";

const router = express.Router();

router.get("/questions/:id/answers", getAnswersByQuestionId);
router.post("/questions/:id/answers", createAnswer);
router.patch("/answers/:id", updateAnswer);
router.delete("/answers/:id", deleteAnswer);

export default router;