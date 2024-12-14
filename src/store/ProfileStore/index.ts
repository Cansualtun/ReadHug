import { toast } from 'sonner';
import { setProfileStore } from './slice';
import {
  IProfileRequest,
  IProfileResponse,
  IUpdateProfileRequest,
  IUpdateProfileResponse,
} from './type';
import { baseApi } from '@/services/baseApi';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    profileUpdate: builder.mutation<
      IUpdateProfileResponse,
      IUpdateProfileRequest
    >({
      query: (credentials) => {
        const token = getFromTokenCookies();
        return {
          url: '/user/updateProfile',
          method: 'PATCH',
          body: credentials,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          // dispatch(
          //   setProfileStore({
          //     profile_update: {},
          //   }),
          // );
          toast.success('Profile updated successfully');
        } catch (error) {
          toast.error('Profile update failed');
          console.error('Profile update error:', error);
        }
      },
    }),
    getProfileStore: builder.mutation<IProfileResponse, IProfileRequest>({
      query: (credentials) => {
        const { userName, type, limit, page } = credentials;

        return {
          url: `/book/user/books/${userName}/${type}?limit=${limit}&page=${page}`,
          method: 'POST',
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        console.log('queryFulfilled', data);
        try {
          dispatch(setProfileStore({ key: 'posts', data }));
          toast.success('Profile data successfully');
        } catch (error) {
          // toast.error('Profile update failed');
          console.error('Profile update error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useProfileUpdateMutation, useGetProfileStoreMutation } =
  profileApi;
