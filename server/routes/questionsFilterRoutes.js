import express from "express";
import { getAllQuestions } from "../controllers/questionsFilterController.js";

const router = express.Router();


router.get("/", getAllQuestions);

export default router;