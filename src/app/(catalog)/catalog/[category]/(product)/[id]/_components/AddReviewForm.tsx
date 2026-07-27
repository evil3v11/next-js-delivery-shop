"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

import IconStar from "@/components/svg/IconStar";

interface AddReviewFormProps {
  productId: number;
  onReviewAdded: () => void;
}

const AddReviewForm = ({ productId, onReviewAdded }: AddReviewFormProps) => {
  const { user } = useAuthStore();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [error, setError] = useState("");

  const isFormValid = rating > 0 && comment.trim().length > 0;

  const handleRatingChange = (star: number): void => {
    setRating(star);
    setShowValidationError(false);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setComment(e.target.value);
    setShowValidationError(false);
  };

  const handleSubmit = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();

    if (!user) {
      setError("Необходимо авторизиоваться");
      return;
    }

    if (!isFormValid) {
      setShowValidationError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setShowValidationError(false);

      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          rating: Number(rating),
          comment: comment.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Ошибка при отправке отзыва");

      setComment("");
      setRating(0);
      onReviewAdded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка при отправке отзыва");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-10">
      <form onSubmit={handleSubmit}>
        <div className="mb-4.5 flex flex-row gap-x-4 items-center">
          <label className="text-lg font-bold">Ваша оценка</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="cursor-pointer hover:scale-110 transition-transform mr-1"
              >
                <IconStar
                  fillPercentage={
                    hoverRating >= star ? 100 : rating >= star ? 100 : 0
                  }
                />
              </button>
            ))}
          </div>
        </div>
        <div className="w-full max-w-136 mb-5">
          <div className="mb-4">
            <textarea
              id="comment"
              placeholder="Отзыв"
              value={comment}
              onChange={handleCommentChange}
              rows={4}
              className="w-full max-w-136 bg-white px-4 py-2 border border-[#bfbfbf] rounded 
              focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            />
          </div>
          {showValidationError && (
            <div className="text-[#d80000] text-sm p-2 bg-[#ffc7c7] rounded mb-2">
              Пожалуйста, поставьте оценку и напишите отзыв
            </div>
          )}
          {error && (
            <div className="text-[#d80000] text-sm p-2 bg-[#ffc7c7] rounded mb-2">
              {error}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-47 p-2 flex items-center justify-center rounded duration-300 cursor-pointer ${
            isSubmitting
              ? "cursor-not-allowed bg-[#fcd5ba] text-secondary"
              : "text-base bg-secondary text-white hover:shadow-article"
          }`}
        >
          {isSubmitting ? "Отправка..." : "Отправить отзыв"}
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;
