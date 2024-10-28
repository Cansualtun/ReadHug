import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/services/baseApi';
import { authApi } from './AuthStore';
import { userApi } from './UserStore';

const rootReducer = combineReducers({
  auth: authApi,
  user: userApi,
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
