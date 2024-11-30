import { baseApi } from '@/services/baseApi';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';
import { setNotification } from './slice';
import { INotificationResponse } from './type';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    notification: builder.mutation<INotificationResponse, void>({
      query: (credentials: any) => {
        console.log('credentials', credentials);

        const token = getFromTokenCookies();
        let url = `/notification/all?page=${credentials.page}&limit=10&sort=desc`;
        if (credentials.onlyCount) {
          url += '&onlyCount=true';
        }
        return {
          url,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      async onQueryStarted(
        credentials: any,
        { dispatch, getState, queryFulfilled },
      ) {
        try {
          const { data: newData } = await queryFulfilled;
          if (!credentials.onlyCount) {
            dispatch(setNotification(newData));
          }
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
