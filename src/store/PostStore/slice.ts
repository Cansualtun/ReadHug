import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
  postComment: {} | null;
  postShare: {} | null;
}

const initialState: PostState = {
  postComment: null,
  postShare: null,
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
    setPostShareStore(
      state,
      action: PayloadAction<{
        postShare?: PostState['postShare'];
      }>,
    ) {
      if (action.payload.postShare) {
        state.postShare = action.payload.postShare;
      }
    },
    clearPostShareStore(state) {
      state.postShare = null;
    },
  },
});

export const {
  setPostStore,
  clearPostStore,
  setPostShareStore,
  clearPostShareStore,
} = postSlice.actions;

export default postSlice.reducer;
