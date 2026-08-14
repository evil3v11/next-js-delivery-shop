"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/store/redux";

const store = makeStore();

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
