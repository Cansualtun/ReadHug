import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {}

const initialState: ProfileState = {};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileStore: (
      state,
      action: PayloadAction<{
        profile_update: {};
      }>,
    ) => {},
    clearProfileStore: (state) => {},
  },
});

export const { setProfileStore, clearProfileStore } = profileSlice.actions;
export default profileSlice.reducer;
