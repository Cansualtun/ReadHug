// store/PostStore/index.ts
import { toast } from 'sonner';
import {
  setPosts,
  setPostShareStore,
  setPostsMore,
  setPostComment,
} from './slice';
import {
  IPostCommentResponse,
  IPostMoreRequest,
  IPostMoreResult,
  IPostRequest,
  IPostResult,
  IPostShareRequest,
  IPostShareResult,
} from './type';
import { baseApi } from '@/services/baseApi';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postComment: builder.mutation<IPostCommentResponse, ''>({
      query: (postId) => {
        const token = getFromTokenCookies();
        return {
          url: `/comment/posts/${postId}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setPostComment({
              postComment: {},
            }),
          );
        } catch (error) {
          toast.error('Post Comment işlemi başarısız oldu');
          console.error('Post Comment error:', error);
        }
      },
    }),
    postShare: builder.mutation<IPostShareResult, IPostShareRequest>({
      query: (credentials) => {
        const token = getFromTokenCookies();

        return {
          url: `posts/user/create`,
          method: 'POST',
          body: credentials,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            postApi.endpoints.posts.initiate({ page: 1, limit: 10 }) as any,
          );
          dispatch(
            setPostShareStore({
              postShare: {},
            }),
          );
        } catch (error) {
          toast.error('Paylaşım işlemi başarısız oldu');
          console.error('Post Comment error:', error);
        }
      },
    }),
    posts: builder.mutation<IPostResult, IPostRequest>({
      query: (credentials: any) => {
        const token = getFromTokenCookies();
        const headers: any = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        return {
          url: `posts/all?page=${credentials.page}&limit=${credentials.limit ?? 10}`,
          method: 'GET',
          headers,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setPosts(data.data));
        } catch (error) {
          toast.error('Post çekme işlemi başarısız oldu');
          console.error('Post Comment error:', error);
        }
      },
    }),
    morePosts: builder.mutation<IPostMoreResult, IPostMoreRequest>({
      query: (credentials: any) => {
        const token = getFromTokenCookies();
        const headers: any = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        return {
          url: `posts/all?page=${credentials.page}&limit=${credentials.limit ?? 10}`,
          method: 'GET',
          headers,
        };
      },
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
    
          dispatch(setPostsMore(data));
        } catch (error) {
          toast.error('Paylaşım işlemi başarısız oldu');
          console.error('Post Comment error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  usePostCommentMutation,
  usePostShareMutation,
  usePostsMutation,
  useMorePostsMutation,
} = postApi;
