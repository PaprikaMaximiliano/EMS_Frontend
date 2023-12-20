import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InititalState = {
  isAuth: boolean;
  username: string;
  uid: string;
  isModerator: boolean;
};

const initialState = {
  isAuth: false,
  username: "",
  uid: "",
  isModerator: false,
} as InititalState;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (state) => {
      state.isAuth = true;
    },
  },
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;
