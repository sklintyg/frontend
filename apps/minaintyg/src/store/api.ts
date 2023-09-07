import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '../schema/user.schema'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => 'user',
      providesTags: ['User'],
    }),
    fakeLogout: builder.mutation<void, void>({
      query: () => ({
        url: 'testability/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useGetUserQuery, useFakeLogoutMutation } = api
