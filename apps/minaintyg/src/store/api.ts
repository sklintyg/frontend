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
      query: () => 'certificates/user',
      providesTags: ['User'],
    }),
    fakeLogout: builder.mutation<void, void>({
      query: () => ({
        url: '../web/logga-ut',
        method: 'GET',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useGetUserQuery, useFakeLogoutMutation } = api
