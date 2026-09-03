"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useProduct } from "@/app/contexts/ProductContext";
import { useArticleTitle } from "@/app/contexts/ArticleContext";
import { useCategoryTitle } from "@/app/contexts/CategoryContext";

import { TRANSLATIONS } from "@/utils/translations";

import Link from "next/link";
import Image from "next/image";

const BreadcrumbsContent = () => {
  const pathname = usePathname();
  const { title } = useProduct();
  const { articleTitle } = useArticleTitle();
  const { categoryTitle } = useCategoryTitle();

  if (pathname === "/" || pathname === "/search") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const productDesc = title;

  const isArticlePage = pathSegments[0] === "blog" && pathSegments.length >= 3;
  const isCategoryPage = pathSegments[0] === "blog" && pathSegments.length >= 2;

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    let label = TRANSLATIONS[segment] || segment;

    if (
      index === pathSegments.length - 1 &&
      productDesc &&
      pathSegments.includes("catalog") &&
      pathSegments.length >= 3
    ) {
      label = productDesc;
    }

    if (isCategoryPage && index === pathSegments.length - 1 && categoryTitle) {
      label = categoryTitle;
    }

    if (isArticlePage && index === pathSegments.length - 2 && categoryTitle) {
      label = categoryTitle;
    }

    if (isArticlePage && index === pathSegments.length - 1 && articleTitle) {
      label = articleTitle;
    }

    let finalHref = href;
    const isLastItem = index === pathSegments.length - 1;
    const isBlogPage = isArticlePage || isCategoryPage;

    if (isLastItem && !isBlogPage) finalHref = `${href}/desc=${productDesc}`;

    return {
      label,
      href: finalHref,
      isLast: isLastItem,
    };
  });

  breadcrumbs.unshift({
    label: "Главная",
    href: "/",
    isLast: false,
  });

  return (
    <nav className="px-[max(12px,calc((100%-1208px)/2))] my-6">
      <ol className="flex flex-wrap items-center gap-4 text-[8px] md:text-sm">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex text-xs items-center gap-4">
            <div
              className={
                item.isLast
                  ? "text-[#8f8f8f]"
                  : "text-main-text hover:underline cursor-pointer"
              }
            >
              {item.isLast ? (
                <span title={item.label}>{item.label}</span>
              ) : (
                <Link href={item.href}>
                  <span title={item.label}>{item.label}</span>
                </Link>
              )}
            </div>
            {!item.isLast && (
              <Image
                src="/icons-products/icon-arrow-right.svg"
                alt={`Переход от ${item.label} к ${breadcrumbs[breadcrumbs.length - 1]}`}
                width={24}
                height={24}
                sizes="24px"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const Breadcrumbs = () => {
  return (
    <Suspense
      fallback={
        <nav className="px-[max(12px,calc((100%-1208px)/2))] my-6">
          <div className="flex items-center gap-4 text-[8px] md:text-xs">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        </nav>
      }
    >
      <BreadcrumbsContent />
    </Suspense>
  );
};

export default Breadcrumbs;
