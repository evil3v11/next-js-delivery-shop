import Image from "next/image";
import Link from "next/link";
import { CatalogProps } from "@/types/catalog";

const GridCategoryBlock = ({ id, img, title }: CatalogProps) => {
  return (
    <Link
      href={`category-${id}`}
      className="block relative h-full overflow-hidden group min-w-40 
                md:min-w-[224px] xl:min-w-[274px]"
    >
      <Image
        src={img}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform group-hover:scale-105"
        priority={false}
      />
      <div
        className="absolute inset-0 top-auto h-[117px] group-hover:h-[177px]
                  bg-[linear-gradient(180deg,rgba(112,192,92,0)_0%,rgba(112,192,92,1)_82.812%)]
                  group-hover:bg-[linear-gradient(180deg,rgba(255,102,51,0)_0%,rgba(255,102,51,1)_100%)]
                  transition-all duration-300"
      />
      <div className="absolute left-2.5 bottom-2.5 flex items-center">
        <span className="text-white text-lg font-bold">{title}</span>
      </div>
    </Link>
  );
};

export default GridCategoryBlock;
