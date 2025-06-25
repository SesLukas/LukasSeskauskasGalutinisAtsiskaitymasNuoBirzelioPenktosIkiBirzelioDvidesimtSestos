import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getAnswersByQuestionId,
  createAnswer,
  updateAnswer,
  deleteAnswer
} from "../controllers/answersController.js";

const router = express.Router();

router.get("/questions/:id/answers", getAnswersByQuestionId);
router.post("/questions/:id/answers", authenticate, createAnswer);
router.patch("/answers/:id", authenticate, updateAnswer);
router.delete("/answers/:id", authenticate, deleteAnswer)

export default router;