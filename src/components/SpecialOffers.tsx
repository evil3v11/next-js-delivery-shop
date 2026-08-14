import Image from "next/image";

const SpecialOffers = () => {
  return (
    <section>
      <div className="flex flex-col gap-y-4 md:gap-y-8 lg:gap-y-10 px-[max(12px,calc((100%-1208px)/2))]">
        <h2 className="text-2xl xl:text-4xl text-left font-bold text-main-text">
          Специальные предложения
        </h2>
        <div className="flex flex-col md:flex-row md:justify-center gap-y-4 md:gap-x-8 xl:gap-x-10 relative">
          <div
            className="h-42.5 w-full xl:w-146 xl:h-auto bg-[#FCD5BA] rounded p-4 shadow-card hover:shadow-banner-orange 
          relative overflow-hidden xl:flex xl:justify-between xl:px-10 xl:py-5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex flex-col w-43.5 gap-y-1.5">
              <h3 className="text-[20px] md:text-[18px] xl:text-[24px] xl:text-4xl font-bold text-main-text leading-[150%]">
                Оформите карту <br /> «Северяночка»
              </h3>
              <p className="text-[12px] xl:text-[16px] text-main-text">
                И получайте бонусы при покупке в магазинах и на сайте
              </p>
            </div>
            <div className="absolute -top-3 -right-20 xl:relative xl:top-0 xl:right-0 xl:scale-140">
              <Image
                src="/images/banners/banner-card-image.png"
                alt="Карта Северяночка"
                width={250}
                height={175}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover w-62.5 h-43.75"
              />
            </div>
          </div>
          <div
            className="flex justify-between h-42.5 w-full xl:w-146 xl:h-auto bg-[#E5FFDE] rounded p-4 
          shadow-card hover:shadow-banner-green relative xl:px-10 xl:py-5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex flex-col w-43.5 gap-y-1.5">
              <h3 className="text-[20px] md:text-[18px] xl:text-[24px] xl:text-4xl font-bold text-main-text leading-[150%]">
                Покупайте акционные товары
              </h3>
              <p className="text-[12px] xl:text-[16px] text-main-text">
                И полуйчайте вдвое <br /> больше бонусов
              </p>
            </div>
            <div className="relative right-5.25">
              <Image
                src="/images/banners/banner-action-cart.png"
                alt="Акционные товары"
                width={132}
                height={126}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover w-33 h-31.5"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
