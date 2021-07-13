import {
  addQuestion,
  clearQuestionDraft,
  deleteQuestion,
  deleteQuestionError,
  deleteQuestionStarted,
  deleteQuestionSuccess,
  getQuestions,
  getQuestionsError,
  getQuestionsStarted,
  getQuestionsSuccess,
  saveQuestion,
  saveQuestionError,
  saveQuestionStarted,
  saveQuestionSuccess,
  sendQuestion,
  sendQuestionError,
  sendQuestionStarted,
  sendQuestionSuccess,
  updateQuestionDraft,
  updateQuestions,
} from './questionActions'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import { updateCertificate } from '../certificate/certificateActions'

export const handleGetQuestions: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getQuestions.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/question/' + action.payload,
      method: 'GET',
      onStart: getQuestionsStarted.type,
      onSuccess: getQuestionsSuccess.type,
      onError: getQuestionsError.type,
    })
  )
}

export const handleGetQuestionsSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getQuestionsSuccess.match(action)) {
    return
  }

  dispatch(updateQuestions(action.payload.questions.filter((value) => value.sent)))

  const questionDraft = action.payload.questions.find((value) => !value.sent)
  if (questionDraft) {
    dispatch(updateQuestionDraft(questionDraft))
  } else {
    dispatch(clearQuestionDraft())
  }
}

export const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!updateCertificate.match(action)) {
    return
  }

  dispatch(getQuestions(action.payload.metadata.id))
}

export const handleDeleteQuestion: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!deleteQuestion.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/question/' + action.payload.id,
      method: 'DELETE',
      onStart: deleteQuestionStarted.type,
      onSuccess: deleteQuestionSuccess.type,
      onError: deleteQuestionError.type,
    })
  )
}

export const handleDeleteQuestionSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!deleteQuestionSuccess.match(action)) {
    return
  }

  dispatch(clearQuestionDraft())
}

export const handleSaveQuestion: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!saveQuestion.match(action)) {
    return
  }

  dispatch(updateQuestionDraft(action.payload))

  dispatch(
    apiCallBegan({
      url: '/api/question/' + action.payload.id,
      method: 'POST',
      data: {
        question: action.payload,
      },
      onStart: saveQuestionStarted.type,
      onSuccess: saveQuestionSuccess.type,
      onError: saveQuestionError.type,
    })
  )
}

export const handleSendQuestion: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!sendQuestion.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/question/' + action.payload.id + '/send',
      method: 'POST',
      data: {
        question: action.payload,
      },
      onStart: sendQuestionStarted.type,
      onSuccess: sendQuestionSuccess.type,
      onError: sendQuestionError.type,
    })
  )
}

export const handleSendQuestionSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!sendQuestionSuccess.match(action)) {
    return
  }

  dispatch(addQuestion(action.payload.question))
  dispatch(clearQuestionDraft())
}

export const questionMiddleware = [
  handleGetQuestions,
  handleGetQuestionsSuccess,
  handleUpdateCertificate,
  handleDeleteQuestion,
  handleDeleteQuestionSuccess,
  handleSaveQuestion,
  handleSendQuestion,
  handleSendQuestionSuccess,
]
