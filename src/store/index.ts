import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/services/baseApi';
//service slices
import { authApi } from './AuthStore';
import { userApi } from './UserStore';
import { likeApi } from './LikeStore';
import { notificationApi } from './NotificationStore';
import { postApi } from './PostStore';

// no service slices
import messageSlice from '@/store/MessageStore';
import postSlice from './PostStore/slice';
import { commentApi } from './CommentStore';

const rootReducer = combineReducers({
  auth: authApi,
  user: userApi,
  like: likeApi,
  comment: commentApi,
  notification: notificationApi,
  post: postSlice,
  message: messageSlice,
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
