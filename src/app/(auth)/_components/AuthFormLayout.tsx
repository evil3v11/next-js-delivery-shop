import { ReactNode } from "react";

import CloseButton from "./CloseButton";

type AuthFormVariant = "register" | "default";

const AuthFormLayout = ({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: AuthFormVariant;
}) => {
  return (
    <div
      className="absolute inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] 
    min-h-screen text-main-text py-1 px-3 backdrop-blur-sm"
    >
      <div
        className={`bg-white rounded shadow-auth-form w-full max-h-[calc(100vh-80px)] flex
        flex-col relative ${variant === "register" ? "max-w-[687px]" : "max-w-[420px]"}`}
      >
        <CloseButton />
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AuthFormLayout;
