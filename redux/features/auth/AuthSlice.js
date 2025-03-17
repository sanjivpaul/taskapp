import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  isFirstLogin: false,
  isFirstLandingScreen: false,
  currentColorTheme: "",
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setIsFirstLogin(state, action) {
      state.isFirstLogin = action.payload;
    },
    setIsFirstLandingScreen(state, action) {
      state.isFirstLandingScreen = action.payload;
    },
    serCurrentColorTheme(state, action) {
      state.currentColorTheme = action.payload;
    },
  },
});

export const {
  setUserData,
  setIsFirstLogin,
  setIsFirstLandingScreen,
  serCurrentColorTheme,
} = AuthSlice.actions;

export default AuthSlice.reducer;
