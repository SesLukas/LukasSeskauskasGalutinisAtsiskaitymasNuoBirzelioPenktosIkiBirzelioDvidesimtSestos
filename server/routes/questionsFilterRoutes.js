import express from "express";
import {
  getFilteredQuestions
} from "../controllers/questionsFilterController.js";

const router = express.Router();


router.get("/questions", getFilteredQuestions);

export default router;