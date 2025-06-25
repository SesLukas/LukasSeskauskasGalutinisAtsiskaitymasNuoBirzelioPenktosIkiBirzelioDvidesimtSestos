import express from "express";
import { filterQuestions } from "../controllers/questionsFilterController.js";

const router = express.Router();

router.get("/", filterQuestions); 

export default router;