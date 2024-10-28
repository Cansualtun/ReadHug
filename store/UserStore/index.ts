import { baseApi } from '@/services/baseApi';
import { toast } from 'react-hot-toast';
import { IMeResponse } from './type';
import { setUserStore } from './slice';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.mutation<IMeResponse, void>({
      query: () => {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

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
  }),
  overrideExisting: false,
});

export const { useMeMutation } = userApi;
