import type { Answer, Complement, Question, QuestionType } from '../types';
import { TAG, api } from './api';

const questionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getQuestions: build.query<Question[], string>({
      query: (cretificateId) => `question/${cretificateId}`,
      transformResponse: (resp: { questions: Question[] }) => resp.questions,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: TAG.QUESTION, id }) as const), { type: TAG.QUESTION, id: 'LIST' }]
          : [{ type: TAG.QUESTION, id: 'LIST' }],
    }),
    createQuestion: build.mutation<Question, { certificateId: string; type: QuestionType; message: string }>({
      query: (data) => ({
        url: `question`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (resp: { question: Question }) => resp.question,
      invalidatesTags: [{ type: TAG.QUESTION, id: 'LIST' }],
    }),
    updateQuestion: build.mutation<Question, Partial<Question> & Pick<Question, 'id'>>({
      query: ({ id, ...data }) => ({
        url: `question/${id}`,
        method: 'POST',
        body: { question: { id, ...data } },
      }),
      transformResponse: (resp: { question: Question }) => resp.question,
      invalidatesTags: (result, error, { id }) => [{ type: TAG.QUESTION, id }],
    }),
    sendQuestion: build.mutation<Question, Question>({
      query: ({ id, ...data }) => ({
        url: `question/${id}/send`,
        method: 'POST',
        body: { question: { id, ...data } },
      }),
      transformResponse: (resp: { question: Question }) => resp.question,
      invalidatesTags: (result, error, { id }) => [{ type: TAG.QUESTION, id }],
    }),
    deleteQuestion: build.mutation<Question, string>({
      query: (id) => ({
        url: `question/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: TAG.QUESTION, id }],
    }),
    handleQuestion: build.mutation<Question, { questionId: Question['id']; handled: boolean }>({
      query: ({ questionId, handled }) => ({
        url: `question/${questionId}/handle`,
        method: 'POST',
        body: { handled },
      }),
      invalidatesTags: (result, error, { questionId }) => [{ type: TAG.QUESTION, questionId }],
    }),
    getQuestionComplements: build.query<Complement[], string>({
      query: (questionId) => `question/${questionId}/complements`,
      transformResponse: (resp: { complements: Complement[] }) => resp.complements,
    }),
    updateAnswer: build.mutation<Answer, { questionId: Question['id']; answer: Answer }>({
      query: ({ questionId, answer }) => ({
        url: `question/${questionId}/saveanswer`,
        method: 'POST',
        body: { message: answer?.message ?? '' },
      }),
      invalidatesTags: (result, error, { questionId }) => [{ type: TAG.QUESTION, questionId }],
    }),
    sendAnswer: build.mutation<Answer, { questionId: Question['id']; answer: Answer }>({
      query: ({ questionId, answer }) => ({
        url: `question/${questionId}/sendanswer`,
        method: 'POST',
        body: { message: answer?.message ?? '' },
      }),
      invalidatesTags: (result, error, { questionId }) => [{ type: TAG.QUESTION, questionId }],
    }),
    deleteAnswer: build.mutation<Answer, string>({
      query: (id) => ({
        url: `question/${id}/answer`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: TAG.QUESTION, id }],
    }),
  }),
})

export const {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useSendQuestionMutation,
  useDeleteQuestionMutation,
  useHandleQuestionMutation,
  useGetQuestionComplementsQuery,
  useUpdateAnswerMutation,
  useSendAnswerMutation,
  useDeleteAnswerMutation,
} = questionApi
