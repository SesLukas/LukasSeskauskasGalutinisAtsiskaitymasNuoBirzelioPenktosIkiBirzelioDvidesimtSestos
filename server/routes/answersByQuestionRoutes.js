import express from "express";
import { getAnswersByQuestionId } from "../controllers/answersByQuestionController.js";

const router = express.Router();


router.get("/questions/:id/answers", getAnswersByQuestionId);

export default router;
