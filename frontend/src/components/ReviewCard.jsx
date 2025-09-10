import React from "react";
import { FiStar, FiUser, FiCalendar } from "react-icons/fi";

const ReviewCard = ({ review }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <FiUser className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {review.userId?.name || "Anonymous User"}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500">{review.rating}/5</span>
            </div>
          </div>
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          <FiCalendar className="h-4 w-4 mr-1" />
          {formatDate(review.createdAt)}
        </div>
      </div>

      {review.comment && (
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
};

export default ReviewCard;
