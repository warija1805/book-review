import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating, size = 'text-lg', interactive = false, onRatingChange }) => {
  const handleClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <FaStar
            key={i}
            className={`${size} ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''} text-yellow-400`}
            onClick={() => handleClick(i)}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className={`${size} ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''} text-yellow-400`}
            onClick={() => handleClick(i)}
          />
        );
      } else {
        stars.push(
          <FaStar
            key={i}
            className={`${size} ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''} text-gray-300`}
            onClick={() => handleClick(i)}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      {renderStars()}
      {!interactive && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
