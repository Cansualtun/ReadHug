import { toast } from 'sonner';
import {
  IChangePasswordRequest,
  IChangePasswordResult,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResult,
} from './type';
import { setAuthStore } from './slice';
import { baseApi } from '@/services/baseApi';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.status) {
            dispatch(
              setAuthStore({
                login_result: {
                  userId: data.userId,
                  access_token: data.access_token,
                },
              }),
            );
            document.cookie = `token=${data.access_token}; path=/; Secure;`;
            toast.success('Welcome to Read Hug');
          } else {
            toast.error(data.message || 'Login failed');
          }
        } catch (error: any) {
          const errorData = error?.error?.data?.message;
          toast.error(errorData || 'Login failed');
          console.error('Login error:', error);
        }
      },
    }),
    register: builder.mutation<IRegisterResult, IRegisterRequest>({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success('Register success!');
          dispatch(setAuthStore({ register: data }));
        } catch (error: any) {
          const errorData = error?.error?.data.message;
          toast.error(errorData || 'Registration failed');
          console.error('Register error:', error);
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => {
        const token = getFromTokenCookies();
        return {
          url: '/logout',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setAuthStore({ logout: true }));
          document.cookie =
            'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        } catch (error: any) {
          const errorData = error?.data;
          toast.error(errorData?.message || 'Logout failed');
          console.error('Logout error:', error);
        }
      },
    }),
    changePassword: builder.mutation<
      IChangePasswordResult,
      IChangePasswordRequest
    >({
      query: (credentials) => {
        const token = getFromTokenCookies();
        return {
          url: '/changePassword',
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
          toast.success('Change password success!');
          dispatch(setAuthStore({ changePassword: data }));
        } catch (error: any) {
          const errorData = error?.data;
          toast.error(errorData?.message || 'Change Password failed');
          console.error('Change Password error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi;
