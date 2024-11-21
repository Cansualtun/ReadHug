import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageState } from './type';
export const initialState: MessageState = {
  isOpenMessage: false,
  messageRow: {},
  user: {},
  notifications: {
    data: [],
    page: null,
    totalPages: null,
    total: null,
    limit: null,
    sort: 'asc',
    totalMessageCount: 0,
  },
};

interface PayloadState {
  status?: boolean;
  messageRow?: any;
  user?: any;
  notifications?: any;
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessageOpened: (state, action: PayloadAction<PayloadState>) => {
      if (action.payload.status === true || action.payload.status === false) {
        state.isOpenMessage = action.payload.status;
      }
      if (action.payload.messageRow) {
        state.messageRow = action.payload.messageRow;
      }
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },
    setNotification: (state, action: PayloadAction<PayloadState>) => {
      state.notifications = action.payload.notifications;
    },
  },
});

export const { setMessageOpened, setNotification } = messageSlice.actions;
export const selectMessageOpened = (state: { message: MessageState }) =>
  state.message;
export const selectMessageCount = (state: { message: MessageState }) =>
  state.message.notifications;

export default messageSlice.reducer;
