import { memo } from "react";

const DiscountBadge = memo(function DiscountBadge({ discountPercent }: { discountPercent: number }) {
  return (
    <div className="bg-secondary rounded py-1 px-2 text-white flex justify-center items-center text-xs">
      -{discountPercent}%
    </div>
  );
});

export default DiscountBadge;