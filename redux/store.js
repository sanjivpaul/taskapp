import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/AuthSlice.js";

import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

let persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

let rootReducer = combineReducers({
  auth: authReducer,
});

let persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
