import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
  postComment: {} | null;
}

const initialState: PostState = {
  postComment: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPostStore(
      state,
      action: PayloadAction<{
        postComment?: PostState['postComment'];
      }>,
    ) {
      if (action.payload.postComment) {
        state.postComment = action.payload.postComment;
      }
    },
    clearPostStore(state) {
      state.postComment = null;
    },
  },
});

export const { setPostStore, clearPostStore } = postSlice.actions;

export default postSlice.reducer;
