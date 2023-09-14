import { api } from './api'

const testabilityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fakeLogout: builder.mutation<void, void>({
      query: () => ({
        url: 'testability/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    getPersons: builder.query<void, void>({
      query: () => 'testability/person',
    }),
  }),
  overrideExisting: false,
})

export const { useFakeLogoutMutation, useGetPersonsQuery } = testabilityApi
