import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as reduxUseDispatch,
  useSelector as reduxUseSelector
} from "react-redux";
import user from "./user";

const store = configureStore({
  reducer: {
    user,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export const useDispatch = () => reduxUseDispatch<StoreDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = reduxUseSelector;
