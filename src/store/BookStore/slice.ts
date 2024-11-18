import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IGlobalResponse } from '@/types';
import { Data } from './type';
import { globalResponseInitialData } from '@/types/initialDatas';

interface BookState extends IGlobalResponse {
  data: Data[];
}

interface IInitialState {
  bookSearchData: BookState;
}

const initialState: IInitialState = {
  bookSearchData: globalResponseInitialData as BookState,
};

const authSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setBookSearchStore(state, action: PayloadAction<any>) {
      state.bookSearchData = action.payload;
    },
    clearBookSearchStore(state) {
      state.bookSearchData.data = [];
    },
  },
});

export const { setBookSearchStore, clearBookSearchStore } = authSlice.actions;

export const selectSearchBook = (state: RootState) =>
  state.book.bookSearchData.data;

export default authSlice.reducer;
