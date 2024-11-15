import { createSlice } from "@reduxjs/toolkit";

interface authState {
  accessToken: string | null;
  user: string | null;
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
