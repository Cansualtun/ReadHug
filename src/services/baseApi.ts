// services/baseApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

let BASE_URL = '';
if (process.env.NODE_ENV === 'development') {
  BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://bookarchive-production.up.railway.app';
}
if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://bookarchive-production.up.railway.app';
}

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers: any) => {
    const token = localStorage.getItem('token');
    token && headers.set('authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  refetchOnFocus: true,
  endpoints: () => ({}),
});
