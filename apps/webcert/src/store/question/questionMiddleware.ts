import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { Answer, CertificateStatus, Complement, QuestionType, ResourceLinkType } from '../../types'
import { getResourceLink } from '../../utils'
import { apiCallBegan, apiGenericError, apiSilentGenericError } from '../api/apiActions'
import { updateCertificate } from '../certificate/certificateActions'
import { getCertificate } from '../certificate/thunks/getCertificate'
import { throwError } from '../error/errorActions'
import { createErrorRequestFromApiError, createErrorRequestWithErrorId } from '../error/errorCreator'
import { ErrorCode, ErrorType } from '../error/errorReducer'
import { RootState } from '../store'
import {
  addAnswer,
  addQuestion,
  clearErrorId,
  clearQuestionDraft,
  createAnswer,
  createQuestion,
  createQuestionStarted,
  createQuestionSuccess,
  deleteAnswer,
  deleteAnswerStarted,
  deleteAnswerSuccess,
  deleteQuestion,
  deleteQuestionStarted,
  deleteQuestionSuccess,
  editAnswer,
  editQuestion,
  getComplementQuestions,
  getQuestions,
  getQuestionsError,
  getQuestionsStarted,
  getQuestionsSuccess,
  handleQuestion,
  handleQuestionStarted,
  handleQuestionSuccess,
  resetState,
  saveAnswer,
  saveAnswerStarted,
  saveAnswerSuccess,
  saveQuestion,
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
  setErrorId,
  toggleQuestionFunctionDisabler,
  updateAnswer,
  updateAnswerDraftSaved,
  updateCertificateId,
  updateComplements,
  updateCreateQuestionsAvailable,
  updateDisplayValidationMessages,
  updateDisplayingCertificateDraft,
  updateHandledQuestion,
  updateIsLoadingQuestions,
  updateQuestion,
  updateQuestionDraft,
  updateQuestionDraftSaved,
  updateQuestionMissingMessage,
  updateQuestionMissingType,
  updateQuestions,
  updateSendingQuestion,
  validateQuestion,
} from './questionActions'

export const handleGetQuestions: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/question/' + action.payload,
        method: 'GET',
        onStart: getQuestionsStarted.type,
        onSuccess: getQuestionsSuccess.type,
        onError: getQuestionsError.type,
        functionDisablerType: toggleQuestionFunctionDisabler.type,
      })
    )
  }

export const handleGetComplementQuestions: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/question/' + action.payload + '/complements',
        method: 'GET',
        onStart: getQuestionsStarted.type,
        onSuccess: getQuestionsSuccess.type,
        onError: apiSilentGenericError.type,
        functionDisablerType: toggleQuestionFunctionDisabler.type,
      })
    )
  }

export const handleGetQuestionsStarted: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(updateIsLoadingQuestions(true))
  }

export const handleGetQuestionsSuccess: Middleware<Dispatch> =
  ({ dispatch, getState }) =>
  () =>
  (action: AnyAction): void => {
    if (!getQuestionsSuccess.match(action)) {
      return
    }

    dispatch(clearErrorId())
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

    const totalComplements = action.payload.questions
      .filter((question) => question.type === QuestionType.COMPLEMENT)
      .reduce((totalComplements, question) => {
        totalComplements.push(...question.complements)
        return totalComplements
      }, [] as Complement[])

    dispatch(updateComplements(totalComplements))
    dispatch(updateIsLoadingQuestions(false))
  }

export const handleGetQuestionsError: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    if (!getQuestionsError.match(action)) {
      return
    }

    const errorRequest = createErrorRequestWithErrorId(
      ErrorType.SILENT,
      ErrorCode.FETCH_QUESTIONS_PROBLEM,
      getState().ui.uiQuestion.certificateId
    )

    dispatch(throwError(errorRequest))
    dispatch(setErrorId(errorRequest.errorId ?? ''))
  }

export const handleUpdateCertificate: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(resetState())

    const isQuestionsActive = getResourceLink(action.payload.links, ResourceLinkType.QUESTIONS)?.enabled

    if (isQuestionsActive) {
      dispatch(updateIsLoadingQuestions(true))
      const isCreateQuestionsAvailable = getResourceLink(action.payload.links, ResourceLinkType.CREATE_QUESTIONS)?.enabled
      dispatch(updateCreateQuestionsAvailable(isCreateQuestionsAvailable))
      dispatch(updateCertificateId(action.payload.metadata.id))
      if (action.payload.metadata.status === CertificateStatus.UNSIGNED) {
        dispatch(updateDisplayingCertificateDraft())
        dispatch(getComplementQuestions(action.payload.metadata.relations.parent?.certificateId ?? action.payload.metadata.id))
      } else {
        dispatch(getQuestions(action.payload.metadata.id))
      }
    }
  }

export const handleResetState: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (): void => {
    dispatch(updateComplements([]))
  }

export const handleDeleteQuestion: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/question/' + action.payload.id,
        method: 'DELETE',
        onStart: deleteQuestionStarted.type,
        onSuccess: deleteQuestionSuccess.type,
        onError: apiGenericError.type,
        functionDisablerType: toggleQuestionFunctionDisabler.type,
      })
    )
  }

export const handleDeleteQuestionSuccess: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (): void => {
    dispatch(clearQuestionDraft())
  }

export const handleEditQuestion: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
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

export const handleValidateQuestion: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateQuestionMissingType(action.payload.type === QuestionType.MISSING))
    dispatch(updateQuestionMissingMessage(!action.payload.message))
  }

export const handleSaveQuestion: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/question/' + action.payload.id,
        method: 'POST',
        data: {
          question: action.payload,
        },
        onStart: saveQuestionStarted.type,
        onSuccess: saveQuestionSuccess.type,
        onError: apiGenericError.type,
        functionDisablerType: toggleQuestionFunctionDisabler.type,
      })
    )
  }

export const handleSaveQuestionSuccess: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (): void => {
    dispatch(updateQuestionDraftSaved(true))
  }

export const handleCreateQuestion: Middleware<Dispatch> =
  ({ dispatch, getState }) =>
  () =>
  (action: AnyAction): void => {
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
        onError: apiGenericError.type,
        functionDisablerType: toggleQuestionFunctionDisabler.type,
      })
    )
  }

export const handleCreateQuestionSuccess: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateQuestionDraft(action.payload.question))
    dispatch(updateQuestionDraftSaved(true))
  }

export const handleSendQuestion: Middleware<Dispatch> =
  ({ dispatch, getState }) =>
  () =>
  (action: AnyAction): void => {
    if (getState().ui.uiQuestion.isQuestionMissingType || getState().ui.uiQuestion.isQuestionMissingMessage) {
      dispatch(updateDisplayValidationMessages(true))
      return
    }

    dispatch(updateSendingQuestion(true))

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
        functionDisablerType: toggleQuestionFunctionDisabler.type,
      })
    )
  }

export const handleSendQuestionSuccess: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(addQuestion(action.payload.question))
    dispatch(clearQuestionDraft())
    dispatch(updateQuestionDraftSaved(false))
  }

export const handleSendQuestionError: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateSendingQuestion(false))
    dispatch(throwError(createErrorRequestFromApiError(action.payload.error)))
  }

export const handleCreateAnswer: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    const newAnswer = { id: '', message: '', author: '', sent: '' } as Answer
    dispatch(addAnswer({ questionId: action.payload.id, answer: newAnswer }))
    dispatch(updateAnswerDraftSaved({ questionId: action.payload.id, isAnswerDraftSaved: false }))
  }

export const handleEditAnswer: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateAnswer(action.payload))
    dispatch(updateAnswerDraftSaved({ isAnswerDraftSaved: false, questionId: action.payload.questionId }))
    dispatch(saveAnswer(action.payload))
  }

export const handleSaveAnswer: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/question/' + action.payload.questionId + '/saveanswer',
        method: 'POST',
        data: {
          message: action.payload.answer.message,
        },
        onStart: saveAnswerStarted.type,
        onSuccess: saveAnswerSuccess.type,
        onError: apiGenericError.type,
        functionDisablerType: toggleQuestionFunctionDisabler.type,
      })
    )
  }

export const handleSaveAnswerSuccess: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateAnswerDraftSaved({ isAnswerDraftSaved: true, questionId: action.payload.question.id }))
  }

export const handleSendAnswer: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
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
        functionDisablerType: toggleQuestionFunctionDisabler.type,
      })
    )
  }

export const handleSendAnswerSuccess: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateQuestion(action.payload.question))
  }

export const handleSendAnswerError: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(throwError(createErrorRequestFromApiError(action.payload.error)))
  }

export const handleDeleteAnswer: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(
      apiCallBegan({
        url: '/api/question/' + action.payload.id + '/answer',
        method: 'DELETE',
        onStart: deleteAnswerStarted.type,
        onSuccess: deleteAnswerSuccess.type,
        onError: apiGenericError.type,
        functionDisablerType: toggleQuestionFunctionDisabler.type,
      })
    )
  }

export const handleDeleteAnswerSuccess: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateQuestion(action.payload.question))
  }

export const handleHandleQuestion: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
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
        onError: apiGenericError.type,
        functionDisablerType: toggleQuestionFunctionDisabler.type,
      })
    )
  }

export const handleHandleQuestionSuccess: ThunkMiddleware<RootState> =
  ({ dispatch, getState }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateQuestion(action.payload.question))
    if (action.payload.question.type === QuestionType.COMPLEMENT && action.payload.question.handled) {
      dispatch(getCertificate(getState().ui.uiQuestion.certificateId))
    }
  }

const middlewareMethods = {
  [getQuestions.type]: handleGetQuestions,
  [getQuestionsStarted.type]: handleGetQuestionsStarted,
  [getComplementQuestions.type]: handleGetComplementQuestions,
  [getQuestionsSuccess.type]: handleGetQuestionsSuccess,
  [getQuestionsError.type]: handleGetQuestionsError,
  [updateCertificate.type]: handleUpdateCertificate,
  [deleteQuestion.type]: handleDeleteQuestion,
  [deleteQuestionSuccess.type]: handleDeleteQuestionSuccess,
  [resetState.type]: handleResetState,
  [editQuestion.type]: handleEditQuestion,
  [validateQuestion.type]: handleValidateQuestion,
  [saveQuestion.type]: handleSaveQuestion,
  [saveQuestionSuccess.type]: handleSaveQuestionSuccess,
  [sendQuestion.type]: handleSendQuestion,
  [sendQuestionSuccess.type]: handleSendQuestionSuccess,
  [sendQuestionError.type]: handleSendQuestionError,
  [createQuestion.type]: handleCreateQuestion,
  [createQuestionSuccess.type]: handleCreateQuestionSuccess,
  [createAnswer.type]: handleCreateAnswer,
  [editAnswer.type]: handleEditAnswer,
  [saveAnswer.type]: handleSaveAnswer,
  [saveAnswerSuccess.type]: handleSaveAnswerSuccess,
  [sendAnswer.type]: handleSendAnswer,
  [sendAnswerSuccess.type]: handleSendAnswerSuccess,
  [sendAnswerError.type]: handleSendAnswerError,
  [deleteAnswer.type]: handleDeleteAnswer,
  [deleteAnswerSuccess.type]: handleDeleteAnswerSuccess,
  [handleQuestion.type]: handleHandleQuestion,
  [handleQuestionSuccess.type]: handleHandleQuestionSuccess,
}

export const questionMiddleware: Middleware<Dispatch> =
  (middlewareAPI: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction): void => {
    next(action)

    if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
      middlewareMethods[action.type](middlewareAPI)(next)(action)
    }
  }
