import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

import { Suspense } from "react";

import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Loader from "@/components/Loader";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Северяночка",
  description: "Доставка и покупка продуктов питания",
};

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
        <Header />
        <Breadcrumbs />
        <Suspense fallback={<Loader />}>{children}</Suspense>
        <Footer />
      </body>
    </html>
  );
}
