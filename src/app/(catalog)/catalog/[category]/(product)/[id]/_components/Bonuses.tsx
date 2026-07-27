import { getBonusWord } from "@/utils/getBonusWord";

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
      <p className="text-xs">
        Вы получате{" "}
        <strong>
          {roundedBonus} {getBonusWord(roundedBonus)}
        </strong>
      </p>
    </div>
  );
};

export default Bonuses;
