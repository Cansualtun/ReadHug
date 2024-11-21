import { toast } from 'sonner';
import { setFollowStore } from './slice';
import { baseApi } from '@/services/baseApi';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';

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
    getFollowList: builder.query<IFollowListResponse, string>({
      query: (userName) => {
        const token = getFromTokenCookies();
        return {
          url: `/follow/${userName}`,
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
            setFollowStore({
              follow: {
                success: data.status,
              },
            }),
          );
        } catch (error) {
          console.error('Follow list error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowListQuery,
} = followApi;
