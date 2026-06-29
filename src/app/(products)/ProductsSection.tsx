import { ProductsSectionProps } from "@/types/productsSection";

import ProductCard from "@/components/ProductCard";
import ViewAllButton from "@/components/ViewAllButton";

const ProductsSection = ({
  title,
  products,
  viewAllBtn,
}: ProductsSectionProps) => {
  return (
    <section>
      <div className="flex flex-col px-[max(12px,calc((100%-1208px)/2))]">
        <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
          <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
            {title}
          </h2>
          {viewAllBtn && (
            <ViewAllButton btnText={viewAllBtn.text} href={viewAllBtn.href} />
          )}
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
          {products.map((item) => (
            <li
              key={item._id}
              className="flex justify-center"
            >
              <ProductCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProductsSection;
