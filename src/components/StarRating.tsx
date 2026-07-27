import { CONFIG } from "../../config/config";
import IconStar from "./svg/IconStar";

const StarRating = ({ rating = 5.0 }: { rating: number }) => {
  const stars = [];

  for (let i = 1; i <= CONFIG.MAX_STAR_AMOUNT; i++) {
    const fillAmount = Math.max(0, Math.min(1, rating - (i - 1)));
    const fillPercentage = Math.round(fillAmount * 100);

    stars.push(<IconStar key={i} fillPercentage={fillPercentage} />);
  }

  return <div className="flex flex-row gap-1">{stars}</div>;
};

export default StarRating;
