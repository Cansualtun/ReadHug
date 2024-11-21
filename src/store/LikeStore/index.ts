import { toast } from 'sonner';
import { setLikeStore } from './slice';
import { baseApi } from '@/services/baseApi';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';

export const likeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    likeComment: builder.mutation<ILikeResponse, ILikeRequest>({
      query: (postId) => {
        const token = getFromTokenCookies();
        return {
          url: `/like/post/${postId}`,
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
            setLikeStore({
              likes: {
                status: data.status,
              },
            }),
          );
        } catch (error) {
          toast.error('Like işlemi başarısız oldu');
          console.error('Like error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLikeCommentMutation } = likeApi;
