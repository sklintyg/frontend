import {
  addQuestion,
  clearQuestionDraft,
  createQuestion,
  createQuestionError,
  createQuestionStarted,
  createQuestionSuccess,
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
  updateCertificateId,
  updateCreateQuestionsAvailable,
  updateQuestionDraft,
  updateQuestionDraftSaved,
  updateQuestions,
} from './questionActions'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import { updateCertificate } from '../certificate/certificateActions'
import { getResourceLink, ResourceLinkType } from '@frontend/common'

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

export const handleGetQuestionsSuccess: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getQuestionsSuccess.match(action)) {
    return
  }

  dispatch(updateQuestions(action.payload.questions.filter((value) => value.sent)))

  if (getState().ui.uiQuestion.isCreateQuestionsAvailable) {
    const questionDraft = action.payload.questions.find((value) => !value.sent)
    if (questionDraft) {
      dispatch(updateQuestionDraft(questionDraft))
      dispatch(updateQuestionDraftSaved(true))
    } else {
      dispatch(updateQuestionDraftSaved(false))
      dispatch(clearQuestionDraft())
    }
  }
}

export const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!updateCertificate.match(action)) {
    return
  }
  const isQuestionsActive = getResourceLink(action.payload.links, ResourceLinkType.QUESTIONS)?.enabled
  if (isQuestionsActive) {
    const isCreateQuestionDraftActive = getResourceLink(action.payload.links, ResourceLinkType.CREATE_QUESTIONS)?.enabled
    dispatch(updateCreateQuestionsAvailable(isCreateQuestionDraftActive))
    dispatch(updateCertificateId(action.payload.metadata.id))
    dispatch(getQuestions(action.payload.metadata.id))
  }
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
  dispatch(updateQuestionDraftSaved(false))

  const questionToSave = { ...action.payload }

  if (!action.payload.id) {
    dispatch(createQuestion(questionToSave))
  } else {
    dispatch(
      apiCallBegan({
        url: '/api/question/' + action.payload.id,
        method: 'POST',
        data: {
          question: questionToSave,
        },
        onStart: saveQuestionStarted.type,
        onSuccess: saveQuestionSuccess.type,
        onError: saveQuestionError.type,
      })
    )
  }
}

export const handleSaveQuestionSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!saveQuestionSuccess.match(action)) {
    return
  }

  dispatch(updateQuestionDraftSaved(true))
}

export const handleCreateQuestion: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!createQuestion.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/question',
      method: 'POST',
      data: {
        certificateId: getState().ui.uiQuestion.certificateId,
        type: action.payload.type,
        message: action.payload.message,
      },
      onStart: createQuestionStarted.type,
      onSuccess: createQuestionSuccess.type,
      onError: createQuestionError.type,
    })
  )
}

export const handleCreateQuestionSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!createQuestionSuccess.match(action)) {
    return
  }

  dispatch(updateQuestionDraft(action.payload.question))
  dispatch(updateQuestionDraftSaved(true))
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
  dispatch(updateQuestionDraftSaved(false))
}

export const questionMiddleware = [
  handleGetQuestions,
  handleGetQuestionsSuccess,
  handleUpdateCertificate,
  handleDeleteQuestion,
  handleDeleteQuestionSuccess,
  handleSaveQuestion,
  handleSaveQuestionSuccess,
  handleSendQuestion,
  handleSendQuestionSuccess,
  handleCreateQuestion,
  handleCreateQuestionSuccess,
]
