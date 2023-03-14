import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../store/store'
import { updateSrsInfo, updateSrsPredictions } from '../../store/srs/srsActions'
import { fakeSrsInfo } from '@frontend/common'
import SrsRisk from './SrsRisk'
import { fakeSrsPrediction } from '@frontend/common/src'

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
        screen.getByText('Risk gäller för ' + srsInfo.predictions[0].diagnosisCode + ' ' + srsInfo.predictions[0].diagnosisDescription)
      ).toBeInTheDocument()
    })

    it('should show title including diagnosis from predictions if set', () => {
      const predictions = [fakeSrsPrediction()]
      renderComponent()
      store.dispatch(updateSrsInfo(undefined))
      store.dispatch(updateSrsPredictions([]))
      expect(
        screen.getByText('Risk gäller för ' + predictions[0].diagnosisCode + ' ' + predictions[0].diagnosisDescription)
      ).toBeInTheDocument()
    })

    it('should show title including diagnosis from predictions if both predictions and srs info is set', () => {
      const predictions = [fakeSrsPrediction()]
      renderComponent()
      store.dispatch(updateSrsInfo(undefined))
      store.dispatch(updateSrsPredictions([]))
      expect(
        screen.getByText('Risk gäller för ' + predictions[0].diagnosisCode + ' ' + predictions[0].diagnosisDescription)
      ).toBeInTheDocument()
    })
  })
})
