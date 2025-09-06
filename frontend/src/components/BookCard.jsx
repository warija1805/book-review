import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const BookCard = ({ book, averageRating }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-gray-600 mb-3">
          by <span className="font-medium">{book.author}</span>
        </p>
        {book.description && (
          <p className="text-gray-700 text-sm line-clamp-3 mb-4">
            {book.description}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={averageRating || 0} size="text-sm" />
        <span className="text-sm text-gray-500">
          {averageRating ? `${averageRating.toFixed(1)} stars` : 'No ratings yet'}
        </span>
      </div>
      
      <div className="flex gap-2">
        <Link
          to={`/books/${book._id}`}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-center text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
