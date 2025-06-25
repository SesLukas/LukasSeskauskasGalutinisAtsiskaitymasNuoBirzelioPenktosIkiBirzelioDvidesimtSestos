import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
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
router.post("/", authenticate, createQuestion);
router.patch("/:id", authenticate, updateQuestion);
router.delete("/questions/:id", authenticate, deleteQuestion);

export default router;

