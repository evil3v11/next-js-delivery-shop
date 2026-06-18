import Slider from "@/components/slider/Slider";
import Promotions from "@/components/Promotions";
import NewProducts from "@/components/NewProducts";
import Purchases from "@/components/Purchases";
import SpecialOffers from "@/components/SpecialOffers";
import Maps from "@/components/Maps";

const Home = () => {
  return (
    <main className="w-full mx-auto mb-20">
      <Slider />
      <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col gap-y-20 md:gap-y-25
      xl:gap-y-30">
        <Promotions />
        <NewProducts />
        <Purchases />
        <SpecialOffers />
        <Maps />
      </div>
    </main>
  );
};

export default Home;
