import { Router } from "express";
import {
  addReview,
  getReviewsForBook,
  getUserReviews,
} from "../controllers/Review_controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// POST /api/reviews (protected)
router.post("/", authenticate, addReview);

// GET /api/reviews/user/me (protected)
router.get("/user/me", authenticate, getUserReviews);

// GET /api/reviews/:bookId
router.get("/:bookId", getReviewsForBook);

export default router;
