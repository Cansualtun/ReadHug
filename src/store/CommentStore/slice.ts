import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface CommentPostState {
  likes: {
    status: boolean;
    message?: string;
  } | null;
}

const initialState: CommentPostState = {
  likes: null,
};

const commentPostSlice = createSlice({
  name: 'commentPost',
  initialState,
  reducers: {
    setCommentPostStore(
      state,
      action: PayloadAction<{
        likes?: CommentPostState['likes'];
      }>,
    ) {
      if (action.payload.likes) {
        state.likes = action.payload.likes;
      }
    },
    clearCommentPostStore(state) {
      state.likes = null;
    },
  },
});

export const { setCommentPostStore, clearCommentPostStore } = commentPostSlice.actions;

export default commentPostSlice.reducer;
