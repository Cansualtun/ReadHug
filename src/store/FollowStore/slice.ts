import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface FollowState {
  followUser: {
    success: boolean;
    isFollowing: boolean;
    message?: string;
  } | null;
  follow: { success: boolean } | null;
}

const initialState: FollowState = {
  followUser: null,
  follow: null,
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    setFollowStore(
      state,
      action: PayloadAction<{
        followUser?: FollowState['followUser'];
        follow?: FollowState['follow'];
      }>,
    ) {
      if (action.payload.followUser) {
        state.followUser = action.payload.followUser;
      }
      if (action.payload.follow) {
        state.follow = action.payload.follow;
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
