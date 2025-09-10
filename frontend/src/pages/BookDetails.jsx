import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { booksAPI, reviewsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import { FiStar, FiUser, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const data = await booksAPI.getBookById(id);
      setBook(data.book || data);
    } catch (err) {
      setError("Failed to fetch book details");
      console.error("Error fetching book:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await reviewsAPI.getReviewsForBook(id);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      setReviewLoading(true);
      await reviewsAPI.addReview({
        ...reviewData,
        bookId: id,
      });

      // Refresh reviews after successful submission
      await fetchReviews();

      // Show success message
      alert("Review submitted successfully!");
    } catch (err) {
      alert("Failed to submit review. Please try again.");
      console.error("Error submitting review:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`h-5 w-5 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
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
          <p className="text-red-600 mb-4">{error || "Book not found"}</p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 flex items-center justify-center"
          >
            <FiArrowLeft className="mr-2" />
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Books
        </Link>

        {/* Book Details */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {book.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-4">
              <FiUser className="h-5 w-5 mr-2" />
              <span className="text-lg">by {book.author}</span>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                {renderStars(Math.round(averageRating))}
                <span className="ml-2 text-lg font-medium text-gray-700">
                  {averageRating > 0 ? averageRating : "No ratings"}
                </span>
              </div>
              <span className="text-gray-500">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            {book.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Form */}
        {isAuthenticated() && (
          <div className="mb-8">
            <ReviewForm onSubmit={handleReviewSubmit} loading={reviewLoading} />
          </div>
        )}

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reviews ({reviews.length})
          </h2>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-600">
                No reviews yet.{" "}
                {isAuthenticated()
                  ? "Be the first to review this book!"
                  : "Login to write a review."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
