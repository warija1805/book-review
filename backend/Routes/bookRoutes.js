import { Router } from "express";
import { getAllBooks, getBookByIdWithReviews } from "../controllers/Book_controller.js";

const router = Router();

// GET /api/books
router.get("/", getAllBooks);

// GET /api/books/:id
router.get("/:id", getBookByIdWithReviews);

export default router;



