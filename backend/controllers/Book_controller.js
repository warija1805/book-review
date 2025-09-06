import Book from "../model/Book.js";
import Review from "../model/Review.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json({ books });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
};

export const getBookByIdWithReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const reviews = await Review.find({ bookId: id }).populate("userId", "name email");
    return res.status(200).json({ book, reviews });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch book", error: error.message });
  }
};



