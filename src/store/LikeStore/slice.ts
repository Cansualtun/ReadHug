import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/src/store';

interface LikeState {
  likes: {
    status: boolean;
    message?: string;
  } | null;
}

const initialState: LikeState = {
  likes: null,
};

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    setLikeStore(
      state,
      action: PayloadAction<{
        likes?: LikeState['likes'];
      }>,
    ) {
      if (action.payload.likes) {
        state.likes = action.payload.likes;
      }
    },
    clearLikeStore(state) {
      state.likes = null;
    },
  },
});

export const { setLikeStore, clearLikeStore } = likeSlice.actions;

export default likeSlice.reducer;
