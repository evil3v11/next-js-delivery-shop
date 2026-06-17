import Slider from "@/components/slider/Slider";
import Promotions from "@/components/Promotions";

const Home = () => {
  return (
    <main className="w-full mx-auto md-20">
      <Slider />
      <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col gap-y-20 md:gap-y-25
      xl:gap-y-30">
        <Promotions />
      </div>
    </main>
  );
};

export default Home;
