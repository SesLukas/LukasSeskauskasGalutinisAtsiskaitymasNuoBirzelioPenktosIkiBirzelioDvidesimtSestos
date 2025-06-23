import express from "express";
import {
  likeQuestion,
  dislikeQuestion,
  removeLike,
  removeDislike,
} from "../controllers/likesController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/questions/:id/like", authenticate, likeQuestion);
router.post("/questions/:id/dislike", authenticate, dislikeQuestion);
router.delete("/questions/:id/like", authenticate, removeLike);
router.delete("/questions/:id/dislike", authenticate, removeDislike);

export default router;
