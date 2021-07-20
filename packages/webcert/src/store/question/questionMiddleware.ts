import {
  addAnswer,
  addQuestion,
  clearQuestionDraft,
  createAnswer,
  createQuestion,
  createQuestionError,
  createQuestionStarted,
  createQuestionSuccess,
  deleteAnswer,
  deleteAnswerError,
  deleteAnswerStarted,
  deleteAnswerSuccess,
  deleteQuestion,
  deleteQuestionError,
  deleteQuestionStarted,
  deleteQuestionSuccess,
  editAnswer,
  editQuestion,
  getQuestions,
  getQuestionsError,
  getQuestionsStarted,
  getQuestionsSuccess,
  handleQuestion,
  handleQuestionError,
  handleQuestionStarted,
  handleQuestionSuccess,
  resetState,
  saveAnswer,
  saveAnswerError,
  saveAnswerStarted,
  saveAnswerSuccess,
  saveQuestion,
  saveQuestionError,
  saveQuestionStarted,
  saveQuestionSuccess,
  sendAnswer,
  sendAnswerError,
  sendAnswerStarted,
  sendAnswerSuccess,
  sendQuestion,
  sendQuestionError,
  sendQuestionStarted,
  sendQuestionSuccess,
  updateAnswer,
  updateAnswerDraftSaved,
  updateCertificateId,
  updateCreateQuestionsAvailable,
  updateDisplayValidationMessages,
  updateHandledQuestion,
  updateQuestion,
  updateQuestionDraft,
  updateQuestionDraftSaved,
  updateQuestionMissingMessage,
  updateQuestionMissingType,
  updateQuestions,
  validateQuestion,
} from './questionActions'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import { updateCertificate } from '../certificate/certificateActions'
import { Answer, getResourceLink, QuestionType, ResourceLinkType } from '@frontend/common'

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
      dispatch(validateQuestion(questionDraft))
      dispatch(updateQuestionDraftSaved(true))
    }
  }

  action.payload.questions
    .filter((question) => question.answer && !question.answer.id)
    .forEach((questionWithAnswerDraft) =>
      dispatch(
        updateAnswerDraftSaved({
          questionId: questionWithAnswerDraft.id,
          isAnswerDraftSaved: true,
        })
      )
    )
}

export const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!updateCertificate.match(action)) {
    return
  }

  dispatch(resetState())

  const isQuestionsActive = getResourceLink(action.payload.links, ResourceLinkType.QUESTIONS)?.enabled

  if (isQuestionsActive) {
    const isCreateQuestionsAvailable = getResourceLink(action.payload.links, ResourceLinkType.CREATE_QUESTIONS)?.enabled
    dispatch(updateCreateQuestionsAvailable(isCreateQuestionsAvailable))
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

export const handleEditQuestion: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!editQuestion.match(action)) {
    return
  }

  dispatch(updateQuestionDraft(action.payload))
  dispatch(updateQuestionDraftSaved(false))
  dispatch(validateQuestion(action.payload))
  dispatch(updateDisplayValidationMessages(false))

  if (!action.payload.id) {
    dispatch(createQuestion(action.payload))
  } else {
    dispatch(saveQuestion(action.payload))
  }
}

export const handleValidateQuestion: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!validateQuestion.match(action)) {
    return
  }

  dispatch(updateQuestionMissingType(action.payload.type === QuestionType.MISSING))
  dispatch(updateQuestionMissingMessage(!action.payload.message))
}

export const handleSaveQuestion: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!saveQuestion.match(action)) {
    return
  }

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

export const handleSendQuestion: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!sendQuestion.match(action)) {
    return
  }

  if (getState().ui.uiQuestion.isQuestionMissingType || getState().ui.uiQuestion.isQuestionMissingMessage) {
    dispatch(updateDisplayValidationMessages(true))
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

export const handleCreateAnswer: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!createAnswer.match(action)) {
    return
  }

  const newAnswer = { id: '', message: '', author: '', sent: '' } as Answer
  dispatch(addAnswer({ questionId: action.payload.id, answer: newAnswer }))
  dispatch(updateAnswerDraftSaved({ questionId: action.payload.id, isAnswerDraftSaved: false }))
}

export const handleEditAnswer: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!editAnswer.match(action)) {
    return
  }

  dispatch(updateAnswer(action.payload))
  dispatch(updateAnswerDraftSaved({ isAnswerDraftSaved: false, questionId: action.payload.questionId }))
  dispatch(saveAnswer(action.payload))
}

export const handleSaveAnswer: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!saveAnswer.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/question/' + action.payload.questionId + '/saveanswer',
      method: 'POST',
      data: {
        message: action.payload.answer.message,
      },
      onStart: saveAnswerStarted.type,
      onSuccess: saveAnswerSuccess.type,
      onError: saveAnswerError.type,
    })
  )
}

export const handleSaveAnswerSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!saveAnswerSuccess.match(action)) {
    return
  }

  dispatch(updateAnswerDraftSaved({ isAnswerDraftSaved: true, questionId: action.payload.question.id }))
}

export const handleSendAnswer: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!sendAnswer.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/question/' + action.payload.questionId + '/sendanswer',
      method: 'POST',
      data: {
        message: action.payload.answer.message,
      },
      onStart: sendAnswerStarted.type,
      onSuccess: sendAnswerSuccess.type,
      onError: sendAnswerError.type,
    })
  )
}

export const handleSendAnswerSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!sendAnswerSuccess.match(action)) {
    return
  }

  dispatch(updateQuestion(action.payload.question))
}

export const handleDeleteAnswer: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!deleteAnswer.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/question/' + action.payload.id + '/answer',
      method: 'DELETE',
      onStart: deleteAnswerStarted.type,
      onSuccess: deleteAnswerSuccess.type,
      onError: deleteAnswerError.type,
    })
  )
}

export const handleDeleteAnswerSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!deleteAnswerSuccess.match(action)) {
    return
  }

  dispatch(updateQuestion(action.payload.question))
}

export const handleHandleQuestion: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!handleQuestion.match(action)) {
    return
  }

  dispatch(updateHandledQuestion(action.payload))

  dispatch(
    apiCallBegan({
      url: '/api/question/' + action.payload.questionId + '/handle',
      method: 'POST',
      data: {
        handled: action.payload.handled,
      },
      onStart: handleQuestionStarted.type,
      onSuccess: handleQuestionSuccess.type,
      onError: handleQuestionError.type,
    })
  )
}

export const handleHandleQuestionSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!handleQuestionSuccess.match(action)) {
    return
  }

  dispatch(updateQuestion(action.payload.question))
}

export const questionMiddleware = [
  handleGetQuestions,
  handleGetQuestionsSuccess,
  handleUpdateCertificate,
  handleDeleteQuestion,
  handleDeleteQuestionSuccess,
  handleEditQuestion,
  handleValidateQuestion,
  handleSaveQuestion,
  handleSaveQuestionSuccess,
  handleSendQuestion,
  handleSendQuestionSuccess,
  handleCreateQuestion,
  handleCreateQuestionSuccess,
  handleCreateAnswer,
  handleEditAnswer,
  handleSaveAnswer,
  handleSaveAnswerSuccess,
  handleSendAnswer,
  handleSendAnswerSuccess,
  handleDeleteAnswer,
  handleDeleteAnswerSuccess,
  handleHandleQuestion,
  handleHandleQuestionSuccess,
]
