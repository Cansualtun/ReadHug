import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { INotificationResponse } from './type';

interface NotificationState extends INotificationResponse {}

const initialState: NotificationState = {
  status: true,
  page: null,
  totalPages: null,
  total: null,
  limit: null,
  sort: 'desc',
  data: [],
  totalMessageCount: 0,
  totalNotificationCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action: PayloadAction<NotificationState>) {
      state = action.payload;
    },
    clearNotification(state) {
      state = {
        status: true,
        page: null,
        totalPages: null,
        total: null,
        limit: null,
        sort: 'desc',
        data: [],
        totalMessageCount: 0,
        totalNotificationCount: 0,
      };
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
// export const selectNotification = (state: RootState) => state.notification;

export const selectNotification = (state: RootState) => {
  const mutations = state.baseApi.mutations;
  const latestFulfilled: any = Object.values(mutations)
    .filter(
      (mutation: any) =>
        mutation.endpointName === 'notification' &&
        mutation.status === 'fulfilled',
    )
    .sort(
      (a: any, b: any) =>
        (b.fulfilledTimeStamp || 0) - (a.fulfilledTimeStamp || 0),
    )[0];

  return latestFulfilled?.data || null;
};

export default notificationSlice.reducer;
