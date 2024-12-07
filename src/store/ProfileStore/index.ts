import { toast } from 'sonner';
import { setProfileStore } from './slice';
import { IUpdateProfileRequest, IUpdateProfileResponse } from './type';
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
          dispatch(
            setProfileStore({
              profile_update: {},
            }),
          );
          toast.success('Profile updated successfully');
        } catch (error) {
          toast.error('Profile update failed');
          console.error('Profile update error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useProfileUpdateMutation } = profileApi;
