import AuthFormLayout from "@/app/(auth)/_components/AuthFormLayout";
import Link from "next/link";

const GoodbyePage = () => {
  return (
    <AuthFormLayout>
      <div className="flex flex-col p-10 gap-y-5">
        <h2 className="text-center text-2xl font-bold">
          Аккаунт успешно удален
        </h2>
        <p>
          Спасибо, что были с нами. <br /> Все ваши данные были успешно удалены.
        </p>
        <Link
          href="/"
          className="w-full rounded py-2 bg-primary hover:bg-primary/80 duration-300 cursor-pointer 
          text-white text-lg text-center"
        >
          На главную
        </Link>
      </div>
    </AuthFormLayout>
  );
};

export default GoodbyePage;
