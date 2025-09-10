import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./model/Book.js";

dotenv.config();

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of narrator Nick Carraway and his mysterious neighbor Jay Gatsby.",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South, told through the perspective of Scout Finch as her father defends a black man falsely accused of rape.",
  },
  {
    title: "1984",
    author: "George Orwell",
    description:
      "A dystopian social science fiction novel that explores themes of totalitarianism, surveillance, and individual freedom in a world where Big Brother watches everything.",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description:
      "A romantic novel that follows the complex relationship between Elizabeth Bennet and Mr. Darcy, exploring themes of love, class, and social expectations in 19th century England.",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description:
      "A coming-of-age story following teenager Holden Caulfield as he navigates life in New York City, dealing with alienation, identity, and the transition from childhood to adulthood.",
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    description:
      "The first book in the beloved series about a young wizard who discovers his magical heritage and attends Hogwarts School of Witchcraft and Wizardry.",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description:
      "An epic fantasy adventure following Frodo Baggins and his companions as they journey to destroy the One Ring and save Middle-earth from the Dark Lord Sauron.",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description:
      "A science fiction masterpiece set on the desert planet Arrakis, following Paul Atreides as he navigates political intrigue, ecological themes, and his destiny as a prophesied leader.",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing books
    await Book.deleteMany({});
    console.log("Cleared existing books");

    // Insert sample books
    const books = await Book.insertMany(sampleBooks);
    console.log(`Inserted ${books.length} sample books`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
