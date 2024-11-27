import { baseApi } from '@/services/baseApi';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';
import { toast } from 'sonner';
import { setCommentPostStore } from './slice';
import { ICommentPostRequest, ICommentPostResponse } from './type';

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    commentPost: builder.mutation<ICommentPostResponse, ICommentPostRequest>({
      query: (credentials: any) => {
        const token = getFromTokenCookies();
        return {
          url: `comment/posts/create`,
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
          // dispatch(
          //   setCommentPostStore({
          //     likes: {
          //       status: data.status,
          //     },
          //   }),
          // );
        } catch (error) {
          toast.error('Like işlemi başarısız oldu');
          console.error('Like error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useCommentPostMutation } = commentApi;
