import { baseApi } from '@/services/baseApi';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
//service slices
import { authApi } from './AuthStore';
import { likeApi } from './LikeStore';
import { notificationApi } from './NotificationStore';
import { userApi } from './UserStore';

// no service slices
import messageSlice from '@/store/MessageStore';
import { commentApi } from './CommentStore';
import postSlice from './PostStore/slice';
import profileSlice from './ProfileStore/slice';

const rootReducer = combineReducers({
  auth: authApi,
  user: userApi,
  like: likeApi,
  comment: commentApi,
  notification: notificationApi,
  post: postSlice,
  message: messageSlice,
  profile: profileSlice,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware),
  });
};

const store = makeStore();

export { store };

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
