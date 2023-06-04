import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserLoggedIn: false,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    login: (state) => {
      state.isUserLoggedIn = !state.isUserLoggedIn;
    },
  },
});

export const { login } = mainSlice.actions;
export default mainSlice.reducer;
