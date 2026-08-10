import { getWordEnding } from "@/utils/getWordEnding";

import Image from "next/image";

const Bonuses = ({ bonus }: { bonus: number }) => {
  const roundedBonus = Math.round(bonus);
  return (
    <div className="flex items-center gap-x-2 mx-auto text-primary">
      <Image
        src="/icons-products/icon-green-smile.svg"
        alt="Бонусы"
        width={24}
        height={11}
      />
      <p className="text-xs my-2">
        Вы получате{" "}
        <strong>
          {roundedBonus} бонус{getWordEnding(roundedBonus)}
        </strong>
      </p>
    </div>
  );
};

export default Bonuses;
