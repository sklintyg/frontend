import type { CreateSickleaveDTO, TestDataOptionsDTO } from '../schemas/testabilitySchema'
import { api } from './api'

const testabilityApi = api.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useCreateDefaultTestDataMutation, useCreateSickLeaveMutation, useGetTestDataOptionsQuery } = testabilityApi
