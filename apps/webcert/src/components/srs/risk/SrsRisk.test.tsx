import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import { updateSrsInfo, updateSrsPredictions, updateSrsQuestions } from '../../../store/srs/srsActions'
import { fakeSrsInfo, fakeSrsPrediction, fakeSrsQuestion } from '@frontend/common'
import SrsRisk, { SRS_RISK_BUTTON_TEXT } from './SrsRisk'
import userEvent from '@testing-library/user-event'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <SrsRisk />
    </Provider>
  )
}

describe('SrsRisk', () => {
  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  describe('title', () => {
    it('should show title including diagnosis from srs info if predictions is not set', () => {
      const srsInfo = fakeSrsInfo()
      renderComponent()
      store.dispatch(updateSrsInfo(srsInfo))
      store.dispatch(updateSrsPredictions([]))
      expect(
        screen.getByText('Risken gäller ' + srsInfo.predictions[0].diagnosisCode + ' ' + srsInfo.predictions[0].diagnosisDescription)
      ).toBeInTheDocument()
    })

    it('should show title including diagnosis from predictions if set', () => {
      const predictions = [fakeSrsPrediction()]
      renderComponent()
      store.dispatch(updateSrsInfo(undefined))
      store.dispatch(updateSrsPredictions(predictions))
      expect(
        screen.getByText('Risken gäller ' + predictions[0].diagnosisCode + ' ' + predictions[0].diagnosisDescription)
      ).toBeInTheDocument()
    })

    it('should show title including diagnosis from predictions if both predictions and srs info is set', () => {
      const predictions = [fakeSrsPrediction()]
      const srsInfo = fakeSrsInfo()
      renderComponent()
      store.dispatch(updateSrsInfo(srsInfo))
      store.dispatch(updateSrsPredictions(predictions))
      expect(
        screen.getByText('Risken gäller ' + predictions[0].diagnosisCode + ' ' + predictions[0].diagnosisDescription)
      ).toBeInTheDocument()
    })
  })

  describe('calculate risk button', () => {
    it('should show title for calculating risk button', () => {
      renderComponent()
      expect(screen.getByText(SRS_RISK_BUTTON_TEXT)).toBeInTheDocument()
    })

    it('should show chevron down icon when button has not been pressed', () => {
      renderComponent()
      expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
    })

    it('should show chevron down icon when button has not been pressed', () => {
      renderComponent()
      userEvent.click(screen.getByText(SRS_RISK_BUTTON_TEXT))
      expect(screen.getByTestId('chevron-up')).toBeInTheDocument()
    })

    it('should show questions when clicking button', () => {
      renderComponent()
      const question = fakeSrsQuestion()
      store.dispatch(updateSrsQuestions([question]))
      userEvent.click(screen.getByText(SRS_RISK_BUTTON_TEXT))
      expect(screen.getByText(question.text)).toBeInTheDocument()
    })
  })
})
