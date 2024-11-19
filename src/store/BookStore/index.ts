import { toast } from 'sonner';
import { baseApi } from '@/services/baseApi';
import { getFromTokenCookies } from '@/utils/getFromTokenCookie';
import { IGetUserBookSearchResponse } from './type';
import { setBookSearchStore } from './slice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserBookSearch: builder.mutation<IGetUserBookSearchResponse, ''>({
      query: (payload) => {
        const token = getFromTokenCookies();
        const { userName, queries }: any = payload;
        let url = `/book/user/search/books/${userName}`;
        if (queries) {
          const queryParams = new URLSearchParams();
          Object.entries(queries).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value.toString());
            }
          });
          if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
          }
        }
        console.log('URL', url);

        return {
          url,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('data', data);

          dispatch(setBookSearchStore({ data }));
        } catch (error) {
          toast.error('Post Comment işlemi başarısız oldu');
          console.error('Post Comment error:', error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserBookSearchMutation } = authApi;
