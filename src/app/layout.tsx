import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { RegFormProvider } from "./contexts/RegFormContext";
import StateProvider from "@/store/StateProvider";
import StoreProvider from "./provider";
import { ProductProvider } from "./contexts/ProductContext";
import { generateSiteMetadata } from "@/utils/metadata/generateSiteMetadata";
import CategoryProvider from "./contexts/CategoryContext";
import ArticleProvider from "./contexts/ArticleContext";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "cyrillic"],
});

export const generateMetadata = async (): Promise<Metadata> =>
  await generateSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rubik.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <StateProvider>
            <RegFormProvider>
              <ProductProvider>
                <CategoryProvider>
                  <ArticleProvider>
                    <Header />
                    <Breadcrumbs />
                    {children}
                    <Footer />
                  </ArticleProvider>
                </CategoryProvider>
              </ProductProvider>
            </RegFormProvider>
          </StateProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
