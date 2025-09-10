import React from "react";
import { Link } from "react-router-dom";
import { FiStar, FiUser } from "react-icons/fi";

const BookCard = ({ book }) => {
  const averageRating =
    book.reviews && book.reviews.length > 0
      ? (
          book.reviews.reduce((sum, review) => sum + review.rating, 0) /
          book.reviews.length
        ).toFixed(1)
      : 0;

  const reviewCount = book.reviews ? book.reviews.length : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <FiUser className="h-4 w-4 mr-1" />
          <span className="text-sm">{book.author}</span>
        </div>

        {book.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {book.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700 ml-1">
                {averageRating > 0 ? averageRating : "No ratings"}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>

          <Link
            to={`/books/${book._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
