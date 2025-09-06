import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reviewsAPI, booksAPI } from '../services/api';
import StarRating from '../components/StarRating';
import { FaBook, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

const MyReviews = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchMyReviews();
  }, [isAuthenticated, navigate]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      // Since we don't have a specific endpoint for user reviews, 
      // we'll fetch all reviews and filter by user
      const response = await reviewsAPI.getReviewsForBook('all'); // This won't work, need to modify approach
      
      // Alternative approach: fetch all books and their reviews, then filter
      const booksResponse = await booksAPI.getAllBooks();
      const books = booksResponse.books;
      
      const reviewsWithBooks = [];
      for (const book of books) {
        try {
          const reviewsResponse = await reviewsAPI.getReviewsForBook(book._id);
          const bookReviews = reviewsResponse.reviews.filter(
            review => review.userId?._id === user?.id || review.userId === user?.id
          );
          
          bookReviews.forEach(review => {
            reviewsWithBooks.push({
              ...review,
              book: book
            });
          });
        } catch (error) {
          console.error(`Error fetching reviews for book ${book._id}:`, error);
        }
      }
      
      setReviews(reviewsWithBooks);
    } catch (error) {
      setError('Failed to fetch your reviews');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isAuthenticated()) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your reviews...</p>
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
            onClick={fetchMyReviews}
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Books
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">
            Reviews you've written for books
          </p>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaBook className="text-gray-400 text-6xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't written any reviews yet. Start by exploring books and sharing your thoughts!
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link
                      to={`/books/${review.book._id}`}
                      className="text-xl font-bold text-blue-600 hover:text-blue-800 mb-1 block"
                    >
                      {review.book.title}
                    </Link>
                    <p className="text-gray-600 mb-2">by {review.book.author}</p>
                    
                    <div className="flex items-center mb-3">
                      <StarRating rating={review.rating} size="text-sm" />
                      <span className="ml-2 text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-1" />
                    {formatDate(review.createdAt)}
                  </div>
                </div>
                
                {review.comment && (
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to={`/books/${review.book._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Book Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {reviews.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            You've written {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
