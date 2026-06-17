import Image from "next/image";

const SlideSecond = () => {
  return (
    <div className="mb-10 md:mb-15 xl:mb-20 h-20 md:h-40 xl:h-50 w-full relative ">
      <Image
        src="/images/graphics/slide-2.jpeg"
        alt="Слайд"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50px, (max-width: 1200px): 75px, 100px"
      />
    </div>
  );
};

export default SlideSecond;
