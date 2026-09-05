import { configureStore } from "@reduxjs/toolkit";
import { ordersApi } from "./api/ordersApi";
import { chatApi } from "./api/chatApi";
import { commentsApi } from "./api/commentsApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      [ordersApi.reducerPath]: ordersApi.reducer,
      [chatApi.reducerPath]: chatApi.reducer,
      [commentsApi.reducerPath]: commentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        ordersApi.middleware,
        chatApi.middleware,
        commentsApi.middleware,
      ),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
