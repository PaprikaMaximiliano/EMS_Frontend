import { createSlice } from "@reduxjs/toolkit";

type InititalState = {
  isAuth: boolean;
  username: string;
  uid: string;
  isModerator: boolean;
  currentLocation: any;
};

const initialState = {
  isAuth: false,
  username: "",
  uid: "",
  isModerator: false,
  currentLocation: null
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
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    }
  },
});

export const { logIn, logOut, setCurrentLocation } = auth.actions;
export default auth.reducer;
