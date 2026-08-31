import { CategoryImageProps } from "@/types/entities";

import Image from "next/image";

const CategoryImage = ({
  category,
  gradientColor,
  hasImage,
}: CategoryImageProps) =>
  hasImage && category.image ? (
    <div className="relative mb-6 w-full max-w-100 h-50 md:h-50 mx-auto rounded overflow-hidden shadow-lg">
      <Image
        src={category.image}
        alt={category.imageAlt || category.name}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 800px) 100vw, 800px"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
    </div>
  ) : (
    <div
      className={`mb-6 w-full h-50 md:h-75 rounded-xl overflow-hidden shadow-lg bg-linear-to-br 
      ${gradientColor} flex items-center justify-center`}
    >
      <div className="text-center p-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );

export default CategoryImage;
