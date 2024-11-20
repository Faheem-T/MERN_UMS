import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface authState {
  accessToken: string | null;
  user: null | {
    id: string;
    username: string;
    email: string;
    role: "user" | "admin";
  };
}
const initialState: authState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      const { user, accessToken } = action.payload;
      state.accessToken = accessToken;
      if (user) {
        state.user = user;
      }
    },
    userLoggedOut: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;

// selectors
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectUser = (state: RootState) => state.auth.user;
