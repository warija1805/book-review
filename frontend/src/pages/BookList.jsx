import React, { useState, useEffect } from 'react';
import { booksAPI, reviewsAPI } from '../services/api';
import BookCard from '../components/BookCard';
import { FaSearch } from 'react-icons/fa';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAllBooks();
      const booksWithRatings = await Promise.all(
        response.books.map(async (book) => {
          try {
            const reviewsResponse = await reviewsAPI.getReviewsForBook(book._id);
            const reviews = reviewsResponse.reviews;
            const averageRating = reviews.length > 0 
              ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
              : 0;
            return { ...book, averageRating };
          } catch (error) {
            console.error(`Error fetching reviews for book ${book._id}:`, error);
            return { ...book, averageRating: 0 };
          }
        })
      );
      setBooks(booksWithRatings);
    } catch (error) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    if (!searchTerm.trim()) {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchBooks}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Book Collection</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No books found matching your search.' : 'No books available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} averageRating={book.averageRating} />
            ))}
          </div>
        )}

        {/* Results count */}
        {searchTerm && (
          <div className="mt-6 text-center text-gray-600">
            Found {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
