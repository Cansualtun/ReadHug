import { baseApi } from '@/services/baseApi';
import { toast } from 'sonner';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';
import { setFollowStore } from './slice';

export const followApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    followUser: builder.mutation<IFollowUserResponse, IFollowUserRequest>({
      query: (request) => {
        const token = getFromTokenCookies();
        return {
          url: '/follow/followUser',
          method: 'POST',
          body: request,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setFollowStore({
              followUser: {
                success: data.success,
                isFollowing: data.isFollowing,
              },
            }),
          );
          toast.success(data.message);
        } catch (error) {
          toast.error('Follow işlemi başarısız oldu');
          console.error('Follow error:', error);
        }
      },
    }),
    unfollowUser: builder.mutation<IFollowUserResponse, IFollowUserRequest>({
      query: (request) => {
        const token = getFromTokenCookies();
        return {
          url: '/follow/unFollowUser',
          method: 'POST',
          body: request,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setFollowStore({
              followUser: {
                success: data.success,
                isFollowing: data.isFollowing,
              },
            }),
          );
          toast.success(data.message);
        } catch (error) {
          toast.error('Follow işlemi başarısız oldu');
          console.error('Follow error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useFollowUserMutation, useUnfollowUserMutation } = followApi;
