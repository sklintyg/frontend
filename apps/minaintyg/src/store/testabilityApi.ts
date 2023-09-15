import { TestabilityPerson } from '../schema/testability/person.schema'
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
    getPersons: builder.query<TestabilityPerson[], void>({
      query: () => 'testability/person',
      transformResponse: (response: { testPerson: TestabilityPerson[] }) => response.testPerson,
    }),
  }),
  overrideExisting: false,
})

export const { useFakeLogoutMutation, useGetPersonsQuery } = testabilityApi
