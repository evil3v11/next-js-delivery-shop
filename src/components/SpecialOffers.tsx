import Image from "next/image";

import bannerCard from "../../public/images/banners/banner-card-image.png";
import actionCart from "../../public/images/banners/banner-action-cart.png";

const SpecialOffers = () => {
  return (
    <section>
      <div className="flex flex-col gap-y-4 md:gap-y-8 lg:gap-y-10">
        <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
          Специальные предложения
        </h2>

        <div
          className="flex flex-col md:flex-row md:justify-center gap-y-4 md:gap-x-8 
      xl:gap-x-10 relative"
        >
          <div
            className="h-[170px] md:w-[352px] xl:w-[584px] xl:h-auto bg-[#FCD5BA] 
          rounded p-4 hover:shadow-banner-orange relative overflow-hidden xl:flex 
          xl:justify-between xl:px-10 xl:py-5"
          >
            <div className="flex flex-col w-[174px] gap-y-1.5">
              <h3
                className="text-[20px] md:text-[18px] xl:text-[24px] xl:text-4xl 
            font-bold text-[#414141] leading-[150%]"
              >
                Оформите карту <br /> «Северяночка»
              </h3>
              <p className="text-[12px] xl:text-[16px] text-[#414141]">
                И получайте бонусы при покупке в магазинах и на сайте
              </p>
            </div>

            <div
              className="absolute -top-3 -right-20 xl:relative xl:top-0 xl:right-0 
          xl:scale-150"
            >
              <Image
                src={bannerCard}
                alt="Карта Северяночка"
                width={250}
                height={175}
                className="object-cover"
              />
            </div>
          </div>

          <div
            className="flex justify-between h-[170px] md:w-[352px] xl:w-[584px] xl:h-auto
          bg-[#E5FFDE] rounded p-4 hover:shadow-banner-green relative xl:px-10 
          xl:py-5"
          >
            <div className="flex flex-col w-[174px] gap-y-1.5">
              <h3
                className="text-[20px] md:text-[18px] xl:text-[24px] xl:text-4xl 
            font-bold text-[#414141] leading-[150%]"
              >
                Покупайте акционные товары
              </h3>
              <p className="text-[12px] xl:text-[16px] text-[#414141]">
                И полуйчайте вдвое <br /> больше бонусов
              </p>
            </div>

            <div className="relative right-[21px]">
              <Image
                src={actionCart}
                alt="Акционные товары"
                width={132}
                height={126}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
