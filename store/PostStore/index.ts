import { baseApi } from '@/services/baseApi';
import { toast } from 'sonner';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';
import { setPostStore } from './slice';
import { IPostCommentResponse } from './type';

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
            setPostStore({
              postComment: {},
            }),
          );
        } catch (error) {
          toast.error('Post Comment işlemi başarısız oldu');
          console.error('Post Comment error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { usePostCommentMutation } = postApi;
