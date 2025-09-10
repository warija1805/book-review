import React, { useState, useEffect } from "react";
import { reviewsAPI } from "../services/api";
import { FiStar, FiBook, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsAPI.getMyReviews();
      setReviews(data);
    } catch (err) {
      setError("Failed to fetch your reviews");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`h-4 w-4 ${
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
          <p className="mt-4 text-gray-600">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">
            Here are all the reviews you've written
          </p>
        </div>

        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FiBook className="h-5 w-5 text-blue-600" />
                      <Link
                        to={`/books/${review.bookId._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {review.bookId?.title || "Unknown Book"}
                      </Link>
                    </div>

                    {review.bookId?.author && (
                      <p className="text-gray-600 mb-3">
                        by {review.bookId.author}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {review.rating}/5
                        </span>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm">
                        <FiCalendar className="h-4 w-4 mr-1" />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    to={`/books/${review.bookId._id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Book Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <FiBook className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't written any reviews yet. Start exploring books and
              share your thoughts!
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
