import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducer/user";

export const store = configureStore({
    reducer: {
        user: userReducer,
      },
});
