import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';
import { FaArrowLeft, FaUser, FaCalendarAlt } from 'react-icons/fa';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const [bookResponse, reviewsResponse] = await Promise.all([
        booksAPI.getBookById(id),
        reviewsAPI.getReviewsForBook(id)
      ]);
      
      setBook(bookResponse.book);
      setReviews(reviewsResponse.reviews);
    } catch (error) {
      setError('Failed to fetch book details');
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating) => {
    setReviewForm({ ...reviewForm, rating });
    setReviewError('');
  };

  const handleCommentChange = (e) => {
    setReviewForm({ ...reviewForm, comment: e.target.value });
    setReviewError('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setReviewError('Please login to submit a review');
      return;
    }

    if (reviewForm.rating === 0) {
      setReviewError('Please select a rating');
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewsAPI.addReview({
        bookId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      
      // Refresh reviews
      const reviewsResponse = await reviewsAPI.getReviewsForBook(id);
      setReviews(reviewsResponse.reviews);
      
      // Reset form
      setReviewForm({ rating: 0, comment: '' });
      setReviewError('');
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Book not found'}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Books
        </button>

        {/* Book Information */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="flex items-center mb-4">
              <StarRating rating={averageRating} size="text-lg" />
              <span className="ml-3 text-gray-600">
                {averageRating > 0 ? `${averageRating.toFixed(1)} stars` : 'No ratings yet'} 
                ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          </div>

          {book.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}
        </div>

        {/* Add Review Form */}
        {isAuthenticated() && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Write a Review</h2>
            
            {reviewError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <StarRating 
                  rating={reviewForm.rating} 
                  interactive={true} 
                  onRatingChange={handleRatingChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={handleCommentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your thoughts about this book..."
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Be the first to review this book!
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">
                        {review.userId?.name || 'Anonymous'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <StarRating rating={review.rating} size="text-sm" />
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
