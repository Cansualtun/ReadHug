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

          //   const mutations = (getState() as any).baseApi.mutations;
          //   const latestFulfilled: any = Object.values(mutations)
          //     .filter(
          //       (mutation: any) =>
          //         mutation.endpointName === 'notification' &&
          //         mutation.status === 'fulfilled',
          //     )
          //     .sort(
          //       (a: any, b: any) =>
          //         (b.fulfilledTimeStamp || 0) - (a.fulfilledTimeStamp || 0),
          //     )[0];
          //   console.log('latestFulfilled', latestFulfilled);
          //   const previousData = latestFulfilled?.data?.data || [];

          //   const combinedData = {
          //     ...newData,
          //     data: [...previousData, ...newData.data],
          //   };
          //   console.log('combinedData', combinedData);

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
