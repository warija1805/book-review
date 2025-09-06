import { Router } from "express";
import { addReview, getReviewsForBook } from "../controllers/Review_controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// POST /api/reviews (protected)
router.post("/", authenticate, addReview);

// GET /api/reviews/:bookId
router.get("/:bookId", getReviewsForBook);

export default router;



