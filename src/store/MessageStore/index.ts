import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageState } from './type';
export const initialState: MessageState = {
  isOpenMessage: false,
  messageRow: {},
  user: {},
};

interface PayloadState {
  status?: boolean;
  messageRow?: any;
  user?: any;
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
  },
});

export const { setMessageOpened } = messageSlice.actions;
export const selectMessageOpened = (state: { message: MessageState }) =>
  state.message;

export default messageSlice.reducer;
