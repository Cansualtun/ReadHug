import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  read: Record<string, any>;
  reading: Record<string, any>;
  wishlist: Record<string, any>;
  posts: Record<string, any>;
}

const initialState: ProfileState = {
  read: {},
  reading: {},
  wishlist: {},
  posts: {},
};

type InitialKeys = keyof ProfileState;

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileStore: (
      state,
      action: PayloadAction<{
        key: InitialKeys;
        data: object;
      }>,
    ) => {
      // profildeki kitap bilgilerinin reduce landığı yer
      const { key, data } = action.payload;
      state[key] = data;
    },
    clearProfileStore: (state) => {},
  },
});

export const { setProfileStore, clearProfileStore } = profileSlice.actions;
export const selectLibrary = (state: any) => state.profile;
export default profileSlice.reducer;
