import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';

interface AuthState {
  login_result: {
    userId: string;
    access_token: string;
  } | null;
  register: any | null;
  logout: any | null;
  changePassword: any | null;
}

const initialState: AuthState = {
  login_result: null,
  register: null,
  logout: null,
  changePassword: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStore(
      state,
      action: PayloadAction<{
        login_result?: AuthState['login_result'];
        register?: any;
        logout?: any;
        changePassword?: any;
      }>,
    ) {
      if (action.payload.login_result) {
        state.login_result = action.payload.login_result;
      }
      if (action.payload.register) {
        state.register = action.payload.register;
      }
      if (action.payload.logout) {
        state.logout = action.payload.logout;
      }
      if (action.payload.changePassword) {
        state.changePassword = action.payload.changePassword;
      }
    },
    clearAuthStore(state) {
      state.login_result = null;
      state.register = null;
      state.logout = null;
      state.changePassword = null;
    },
  },
});

export const { setAuthStore, clearAuthStore } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth.login_result;
export const selectRegister = (state: RootState) => state.auth.register;
export const selectLogout = (state: RootState) => state.auth.logout;
export const selectChangePassword = (state: RootState) =>
  state.auth.changePassword;

export default authSlice.reducer;
