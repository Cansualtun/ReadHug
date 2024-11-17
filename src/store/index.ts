import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authApi } from './AuthStore';
import { userApi } from './UserStore';
import { likeApi } from './LikeStore';
import { baseApi } from '@/services/baseApi';

const rootReducer = combineReducers({
  auth: authApi,
  user: userApi,
  like: likeApi,
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
