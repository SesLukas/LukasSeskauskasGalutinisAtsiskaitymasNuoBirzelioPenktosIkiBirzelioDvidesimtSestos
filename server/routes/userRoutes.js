
import express from "express";
import { getCurrentUser, updateCurrentUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.get("/me", authenticate, getCurrentUser);
router.patch("/me", authenticate, updateCurrentUser);

export default router;
