import Review from "../model/Review.js";
import Book from "../model/Book.js";

export const addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!bookId || !rating) {
      return res.status(400).json({ message: "bookId and rating are required" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const review = await Review.create({ bookId, userId, rating, comment });
    return res.status(201).json({ message: "Review added", review });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add review", error: error.message });
  }
};

export const getReviewsForBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ bookId }).populate("userId", "name email").sort({ createdAt: -1 });
    return res.status(200).json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};



