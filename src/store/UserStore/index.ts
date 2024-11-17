import { toast } from 'sonner';
import { IMeResponse, IUserProfileRequest, IUserProfileResponse } from './type';
import { setUserStore } from './slice';
import { baseApi } from '@/services/baseApi';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.mutation<IMeResponse, void>({
      query: () => {
        const token = getFromTokenCookies();
        console.log(token, 'anaana');
        return {
          url: '/user/me',
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
            setUserStore({
              me_result: {
                userId: data.data._id,
              },
            }),
          );
          localStorage.setItem('userId', data.data._id);
        } catch (error) {
          toast.error('Me Service failed');
          console.error('Me Service error:', error);
        }
      },
    }),
    userProfile: builder.query<IUserProfileResponse, IUserProfileRequest>({
      query: (userName) => {
        const token = getFromTokenCookies();
        return {
          url: `/user/profile/${userName}`,
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
            setUserStore({
              profile_result: data as any,
            }),
          );
        } catch (error) {
          toast.error('Profile Service failed');
          console.error('Profile Service error:', error);
        }
      },
    }),
  }),

  overrideExisting: false,
});

export const { useMeMutation, useUserProfileQuery } = userApi;
