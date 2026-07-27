"use client";

import { useState } from "react";
import ProductsReviews from "./ProductsReviews";
import AddReviewForm from "./AddReviewForm";

const ReviewWrapper = ({ productId }: { productId: number }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewAdded = (): void => setRefreshKey((prev) => prev + 1);

  return (
    <div className="flex flex-col w-full md:flex-1 min-w-0">
      <ProductsReviews productId={productId} refreshKey={refreshKey} />
      <AddReviewForm productId={productId} onReviewAdded={handleReviewAdded} />
    </div>
  );
};

export default ReviewWrapper;
