import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "./features/api/usersApi";
import authReducer from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    auth: authReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(usersApi.middleware);
  },
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
