import { Suspense } from "react";

import Slider from "@/components/slider/Slider";
import Promotions from "./(products)/Promotions";
import NewProducts from "./(products)/NewProducts";
import Purchases from "./(user)/Purchases";
import SpecialOffers from "@/components/SpecialOffers";
import Maps from "@/components/Maps";
import Articles from "./(articles)/Articles";
import Loader from "@/components/Loader";

const Home = () => {
  return (
    <main className="w-full mx-auto mb-20">
      <Suspense fallback={<Loader text="слайдера" />}>
        <Slider />
      </Suspense>
      <div
        className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col gap-y-20 md:gap-y-25
      xl:gap-y-30"
      >
        {[
          { component: <Promotions />, text: "акций" },
          { component: <NewProducts />, text: "новинок" },
          { component: <Purchases />, text: "покупок" },
          { component: <SpecialOffers />, text: "специальных предложений" },
          { component: <Maps />, text: "карт" },
          { component: <Articles />, text: "статей" },
        ].map((item, index) => (
          <Suspense key={index} fallback={<Loader text={item.text} />}>
            {item.component}
          </Suspense>
        ))}
      </div>
    </main>
  );
};

export default Home;
