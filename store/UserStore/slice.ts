import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';

interface UserState {
  me_result: {
    userId: string;
  } | null;
}

const initialState: UserState = {
  me_result: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserStore(
      state,
      action: PayloadAction<{
        me_result?: UserState['me_result'];
      }>,
    ) {
      if (action.payload.me_result) {
        state.me_result = action.payload.me_result;
      }
    },
    clearUserStore(state) {
      state.me_result = null;
    },
  },
});

export const { setUserStore, clearUserStore } = userSlice.actions;

export const selectAuth = (state: RootState) => state.auth.login_result;

export default userSlice.reducer;
