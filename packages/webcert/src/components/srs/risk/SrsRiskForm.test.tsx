import { SrsAnswer, fakeSrsAnswerOption, fakeSrsPrediction, fakeSrsQuestion } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { logSrsInteraction, updateSrsPredictions, updateSrsQuestions } from '../../../store/srs/srsActions'
import { srsMiddleware } from '../../../store/srs/srsMiddleware'
import dispatchHelperMiddleware, { dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import SrsRiskForm from './SrsRiskForm'

let testStore: EnhancedStore

const renderComponent = (previousAnswers?: SrsAnswer[]) => {
  render(
    <Provider store={testStore}>
      <SrsRiskForm
        previousAnswers={previousAnswers ? previousAnswers : []}
        onClick={() => {
          return
        }}
      />
    </Provider>
  )
}

describe('SrsRiskForm', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, srsMiddleware])
  })

  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  describe('layout', () => {
    it('should show radio button for each answer option', () => {
      const answerOptions = [fakeSrsAnswerOption(), fakeSrsAnswerOption()]
      const question = fakeSrsQuestion(answerOptions)
      renderComponent()
      act(() => testStore.dispatch(updateSrsQuestions([question])))
      expect(screen.getAllByRole('radio')).toHaveLength(2)
    })

    it('should show label for each answer option', () => {
      const answerOptions = [fakeSrsAnswerOption(), fakeSrsAnswerOption()]
      const question = fakeSrsQuestion(answerOptions)
      renderComponent()
      act(() => testStore.dispatch(updateSrsQuestions([question])))
      expect(screen.getByText(answerOptions[0].text)).toBeInTheDocument()
      expect(screen.getByText(answerOptions[1].text)).toBeInTheDocument()
    })

    it('should show calculate button', () => {
      renderComponent()
      expect(screen.getByText('Beräkna')).toBeInTheDocument()
    })

    it('should show info box if old model version is used', () => {
      renderComponent()
      const prediction = fakeSrsPrediction()
      prediction.modelVersion = '2.1'
      act(() => testStore.dispatch(updateSrsPredictions([prediction])))
      expect(screen.getByText('Tidigare risk beräknades med annan version av prediktionsmodellen.', { exact: false })).toBeInTheDocument()
    })

    it('should not show info box if old model version is not used', () => {
      renderComponent()
      const prediction = fakeSrsPrediction()
      prediction.modelVersion = '3.0'
      act(() => testStore.dispatch(updateSrsPredictions([prediction])))
      expect(
        screen.queryByText('Tidigare risk beräknades med annan version av prediktionsmodellen.', { exact: false })
      ).not.toBeInTheDocument()
    })
  })

  describe('checked options', () => {
    it('should check previous answers if available in predictions', () => {
      const notDefault = fakeSrsAnswerOption(false)
      const defaultOption = fakeSrsAnswerOption(true)
      const answerOptions = [defaultOption, notDefault]
      const question = fakeSrsQuestion(answerOptions)
      renderComponent([{ questionId: question.questionId, answerId: notDefault.id }])
      act(() => testStore.dispatch(updateSrsQuestions([question])))
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons[0]).not.toBeChecked()
      expect(radioButtons[1]).toBeChecked()
    })

    it('should check pressed radio button', async () => {
      const answerOptions = [fakeSrsAnswerOption(true), fakeSrsAnswerOption(false)]
      const question = fakeSrsQuestion(answerOptions)
      renderComponent()
      act(() => testStore.dispatch(updateSrsQuestions([question])))
      const radioButtons = screen.getAllByRole('radio')
      await userEvent.click(radioButtons[1])
      expect(radioButtons[0]).not.toBeChecked()
      expect(radioButtons[1]).toBeChecked()
    })

    it('should check default option if previous answers are missing', () => {
      const answerOptions = [fakeSrsAnswerOption(true), fakeSrsAnswerOption(false)]
      const question = fakeSrsQuestion(answerOptions)
      renderComponent()
      act(() => testStore.dispatch(updateSrsQuestions([question])))
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons[0]).toBeChecked()
      expect(radioButtons[1]).not.toBeChecked()
    })

    it('should check default option if old prediction model is being used', () => {
      const notDefault = fakeSrsAnswerOption(false)
      const defaultOption = fakeSrsAnswerOption(true)
      const answerOptions = [defaultOption, notDefault]
      const question = fakeSrsQuestion(answerOptions)
      const predictions = fakeSrsPrediction()
      predictions.modelVersion = '2.1'
      testStore.dispatch(updateSrsPredictions([predictions]))
      renderComponent([{ questionId: question.questionId, answerId: notDefault.id }])
      act(() => testStore.dispatch(updateSrsQuestions([question])))
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons[0]).toBeChecked()
      expect(radioButtons[1]).not.toBeChecked()
    })

    it('shall log when answering question', async () => {
      const answerOptions = [fakeSrsAnswerOption(true), fakeSrsAnswerOption(false)]
      const question = fakeSrsQuestion(answerOptions)
      renderComponent()
      act(() => testStore.dispatch(updateSrsQuestions([question])))
      const radioButtons = screen.getAllByRole('radio')

      await userEvent.click(radioButtons[1])
      expect(dispatchedActions.find((a) => a.type === logSrsInteraction.type)).not.toBeUndefined()
    })
  })
})
