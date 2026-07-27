import { useEffect, useState } from "react";

import StarRating from "@/components/StarRating";
import Image from "next/image";
import ErrorComponent from "@/components/ErrorComponent";

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductsReviewsProps {
  productId: number;
  refreshKey: number;
}

const ProductsReviews = ({
  productId,
  refreshKey = 0,
}: ProductsReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);

  const fetchReviews = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${productId}/reviews`);
      if (!response.ok) throw new Error("Ошибка при запросе отзывов");
      const reviews = await response.json();
      setReviews(reviews);
    } catch (e) {
      setError({
        error:
          e instanceof Error ? e : new Error("Не удалось загрузить отзывы"),
        userMessage: "Не удалось загрузить отзывы",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, refreshKey]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Отзывы</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-lg">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Отзывы</h2>
      {reviews.length === 0 ? (
        <p className="text-main-text">Пока нет отзывов. Будьте первым!</p>
      ) : (
        <div className="flex flex-col gap-y-10">
          {reviews.map((review) => {
            const userName = review.userName || "Неизвестный пользователь";
            return (
              <div key={review._id}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-[47px] border border-[#f3f2f1] p-2.5 w-9 h-9 flex items-center justify-center">
                    <Image
                      src="/icons-products/icon-user.svg"
                      alt="Пользователь"
                      width={16}
                      height={16}
                    />
                  </div>
                  <span className="text-lg">{userName}</span>
                </div>
                <div className="flex flex-row items-center gap-x-4 mb-2">
                  <StarRating rating={review.rating} />
                  <span className="text-[#8f8f8f] text-xs">
                    {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <p className="text-main-text text-base">{review.comment}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsReviews;
