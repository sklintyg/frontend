import { getQuestions, getQuestionsError, getQuestionsStarted, getQuestionsSuccess, updateQuestions } from './questionActions'
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

  dispatch(updateQuestions(action.payload.questions))
}

export const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!updateCertificate.match(action)) {
    return
  }

  dispatch(getQuestions(action.payload.metadata.id))
}

export const questionMiddleware = [handleGetQuestions, handleGetQuestionsSuccess, handleUpdateCertificate]
