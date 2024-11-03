import { baseApi } from '@/services/baseApi';
import { toast } from 'react-hot-toast';
import {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResult,
} from './type';
import { setAuthStore } from './slice';
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
          dispatch(
            setAuthStore({
              login_result: {
                userId: data.userId,
                access_token: data.access_token,
              },
            }),
          );
          document.cookie = `token=${data.access_token}; path=/; Secure;`;
          toast.success('Welcome to Books Addict');
        } catch (error) {
          toast.error('Login failed');
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
        } catch (error) {
          toast.error('Registration failed');
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
          toast.success('Logout success!');
          dispatch(setAuthStore({ logout: true }));
          document.cookie =
            'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        } catch (error) {
          toast.error('Logout failed');
          console.error('Logout error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApi;
