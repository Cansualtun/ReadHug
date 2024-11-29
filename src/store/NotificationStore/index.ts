import { baseApi } from '@/services/baseApi';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';
import { setNotification } from './slice';
import { INotificationResponse } from './type';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    notification: builder.mutation<INotificationResponse, void>({
      query: (credentials: any) => {
        const token = getFromTokenCookies();
        return {
          url: `/notification/all?page=${credentials}&limit=10&sort=desc`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        try {
          const { data: newData } = await queryFulfilled;
          dispatch(setNotification(newData));
        } catch (error) {
          // toast.error('Me Service failed');
          console.error('Me Service error:', error);
        }
      },
    }),
  }),

  overrideExisting: false,
});

export const { useNotificationMutation } = notificationApi;
