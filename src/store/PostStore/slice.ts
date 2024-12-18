// store/PostStore/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
interface PostState {
  postComment: {} | null;
  postShare: {} | null;
  posts: any[] | null;
}

const initialState: PostState = {
  postComment: null,
  postShare: null,
  posts: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<any>) {
      state.posts = action.payload as any;
    },
    setPostsMore(state, action: PayloadAction<any>) {
      if (action.payload.data.length > 0) {
        state.posts = [...(state.posts as any[]), ...action.payload.data];
      }
    },
    setPostComment(
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
  setPosts,
  setPostsMore,
  setPostComment,
  clearPostStore,
  setPostShareStore,
  clearPostShareStore,
} = postSlice.actions;

export const selectPost = (state: RootState) => {
  return state.post?.posts || []; // Eğer post undefined ise boş dizi dönsün
};
export default postSlice.reducer;
