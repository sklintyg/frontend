import type { CreateSickleaveDTO, TestDataOptionsDTO } from '../schemas/testabilitySchema'
import { api, tagType } from './api'

const testabilityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fakeLogin: builder.mutation<void, { hsaId: string; enhetId: string }>({
      query: (body) => ({
        url: '/testability/fake',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
        window.location.assign('/')
      },
    }),
    fakeLogout: builder.mutation<void, void>({
      query: () => ({
        url: '/testability/logout',
        method: 'POST',
      }),
      invalidatesTags: [tagType.USER],
    }),
    createDefaultTestData: builder.mutation<string, void>({
      query: () => ({
        url: '/testability/createDefault',
        method: 'POST',
      }),
      transformResponse: (response: { content: string }) => response.content,
    }),
    getTestDataOptions: builder.query<TestDataOptionsDTO, void>({
      query: () => ({
        url: '/testability/testDataOptions',
        method: 'GET',
      }),
    }),
    createSickLeave: builder.mutation<string, CreateSickleaveDTO>({
      query: (request) => ({
        url: '/testability/createSickLeave',
        method: 'POST',
        body: request,
      }),
      transformResponse: (response: { content: string }) => response.content,
    }),
  }),
  overrideExisting: false,
})

export const {
  useFakeLoginMutation,
  useFakeLogoutMutation,
  useCreateDefaultTestDataMutation,
  useCreateSickLeaveMutation,
  useGetTestDataOptionsQuery,
} = testabilityApi
