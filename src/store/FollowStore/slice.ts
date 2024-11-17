import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/src/store';

interface FollowState {
  followUser: {
    success: boolean;
    isFollowing: boolean;
    message?: string;
  } | null;
}

const initialState: FollowState = {
  followUser: null,
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    setFollowStore(
      state,
      action: PayloadAction<{
        followUser?: FollowState['followUser'];
      }>,
    ) {
      if (action.payload.followUser) {
        state.followUser = action.payload.followUser;
      }
    },
    clearFollowStore(state) {
      state.followUser = null;
    },
  },
});

export const { setFollowStore, clearFollowStore } = followSlice.actions;

export const selectFollow = (state: RootState) => state.follow.followUser;

export default followSlice.reducer;