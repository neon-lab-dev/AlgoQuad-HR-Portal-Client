import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

type TAuthUser = {
  user: null | object;
  token: null | string;
  redirectPath: string | null,
};

const initialState: TAuthUser = {
  user: null,
  token: null,
  redirectPath: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setRedirectPath: (state, action) => {
      state.redirectPath = action.payload;
    },
    clearRedirectPath: (state) => {
      state.redirectPath = null;
    },
  },
});

export const { setUser, logout, setRedirectPath, clearRedirectPath } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentUser = (state: RootState) => state.auth.user;
export const useAuthToken = (state: RootState) => state.auth.token;
export const useRedirectPath = (state: RootState) => state.auth.redirectPath;
