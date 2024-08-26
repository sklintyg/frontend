import { getByType } from '@frontend/utils'
import type { EnhancedStore } from '@reduxjs/toolkit'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { fakeSrsInfo, fakeSrsPrediction, fakeSrsQuestion } from '../../../faker'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import {
  logSrsInteraction,
  updateSickLeaveChoice,
  updateSrsInfo,
  updateSrsPredictions,
  updateSrsQuestions,
} from '../../../store/srs/srsActions'
import { srsMiddleware } from '../../../store/srs/srsMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { SrsSickLeaveChoice } from '../../../types'
import SrsRisk, { SRS_RISK_BUTTON_TEXT } from './SrsRisk'

let store: EnhancedStore
const renderComponent = () => {
  render(
    <Provider store={store}>
      <SrsRisk />
    </Provider>
  )
}

describe('SrsRisk', () => {
  beforeEach(() => {
    store = configureApplicationStore([dispatchHelperMiddleware, srsMiddleware])
    HTMLElement.prototype.scrollIntoView = vi.fn()

    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  describe('title', () => {
    it('should show title including diagnosis from srs info if predictions is not set', () => {
      const srsInfo = fakeSrsInfo()
      renderComponent()
      act(() => {
        store.dispatch(updateSrsInfo(srsInfo))
        store.dispatch(updateSrsPredictions([]))
      })
      expect(
        screen.getByText(`Risken gäller ${srsInfo.predictions[0].diagnosisCode} ${srsInfo.predictions[0].diagnosisDescription}`)
      ).toBeInTheDocument()
    })

    it('should show title including diagnosis from predictions if set', () => {
      const predictions = [fakeSrsPrediction()]
      renderComponent()
      store.dispatch(updateSrsInfo(undefined))
      store.dispatch(updateSrsPredictions(predictions))
      expect(screen.getByText(`Risken gäller ${predictions[0].diagnosisCode} ${predictions[0].diagnosisDescription}`)).toBeInTheDocument()
    })

    it('should show title including diagnosis from predictions if both predictions and srs info is set', () => {
      const predictions = [fakeSrsPrediction()]
      const srsInfo = fakeSrsInfo()
      renderComponent()
      store.dispatch(updateSrsInfo(srsInfo))
      store.dispatch(updateSrsPredictions(predictions))
      expect(screen.getByText(`Risken gäller ${predictions[0].diagnosisCode} ${predictions[0].diagnosisDescription}`)).toBeInTheDocument()
    })

    it('should show title including diagnosis from last predictions matching chosen diagnosis code', () => {
      const chosenPrediction = fakeSrsPrediction('J201')
      const predictions = [fakeSrsPrediction('J20'), fakeSrsPrediction('J30'), chosenPrediction]
      const srsInfo = fakeSrsInfo()
      renderComponent()
      store.dispatch(updateSrsInfo(srsInfo))
      store.dispatch(updateSrsPredictions(predictions))
      expect(
        screen.getByText(`Risken gäller ${chosenPrediction.diagnosisCode} ${chosenPrediction.diagnosisDescription}`)
      ).toBeInTheDocument()
    })
  })

  describe('show risk form button', () => {
    it('should show title for calculating risk button', () => {
      renderComponent()
      expect(screen.getByText(SRS_RISK_BUTTON_TEXT)).toBeInTheDocument()
    })

    it('should show chevron down icon when button has not been pressed', () => {
      renderComponent()
      expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
    })

    it('should show chevron up icon when button has not been pressed', async () => {
      renderComponent()
      await userEvent.click(screen.getByText(SRS_RISK_BUTTON_TEXT))
      expect(screen.getByTestId('chevron-up')).toBeInTheDocument()
    })

    it('should show questions when clicking button', async () => {
      renderComponent()
      const question = fakeSrsQuestion()
      store.dispatch(updateSrsQuestions([question]))
      await userEvent.click(screen.getByText(SRS_RISK_BUTTON_TEXT))
      expect(screen.getByText(question.text)).toBeInTheDocument()
    })

    it('should log when clicking button', async () => {
      renderComponent()
      await userEvent.click(screen.getByText(SRS_RISK_BUTTON_TEXT))
      expect(getByType(dispatchedActions, logSrsInteraction.type)).not.toBeUndefined()
    })

    it('should disabled button when choosing extension after 60 days sickleave option', async () => {
      renderComponent()
      store.dispatch(updateSickLeaveChoice(SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS))
      await expect(screen.getByText(SRS_RISK_BUTTON_TEXT)).toBeDisabled()
    })
  })

  describe('calculate risk button', () => {
    it('should show button when opening form', async () => {
      renderComponent()
      await userEvent.click(screen.getByText(SRS_RISK_BUTTON_TEXT))
      expect(screen.getByText('Beräkna')).toBeInTheDocument()
    })

    it('should log when clicking button', async () => {
      renderComponent()
      await userEvent.click(screen.getByText(SRS_RISK_BUTTON_TEXT))
      await userEvent.click(screen.getByText('Beräkna'))
      expect(getByType(dispatchedActions, logSrsInteraction.type)).not.toBeUndefined()
    })

    it('should close risk form if open risk form button gets disabled', async () => {
      renderComponent()
      const question = fakeSrsQuestion()
      store.dispatch(updateSrsQuestions([question]))
      await userEvent.click(screen.getByText(SRS_RISK_BUTTON_TEXT))
      await userEvent.click(screen.getByText('Beräkna'))
      expect(screen.queryByText(question.text)).not.toBeInTheDocument()
    })
  })
})
