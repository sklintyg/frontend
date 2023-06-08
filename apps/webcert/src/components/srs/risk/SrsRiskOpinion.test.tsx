import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import SrsRiskOpinion from './SrsRiskOpinion'
import { SRS_OPINION_LABELS } from '../srsUtils'
import { updateSrsPredictions } from '../../../store/srs/srsActions'
import { fakeSrsPrediction } from '@frontend/common'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <SrsRiskOpinion />
    </Provider>
  )
}

describe('SrsRiskOpinion', () => {
  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render four radio buttons', () => {
    store.dispatch(updateSrsPredictions([fakeSrsPrediction(), fakeSrsPrediction()]))
    renderComponent()
    expect(screen.getAllByRole('radio')).toHaveLength(4)
  })

  it.each(SRS_OPINION_LABELS)('should render radio button label', (label) => {
    store.dispatch(updateSrsPredictions([fakeSrsPrediction(), fakeSrsPrediction()]))
    renderComponent()
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('should not render radio buttons if current risk is not calculated', () => {
    store.dispatch(updateSrsPredictions([]))
    renderComponent()
    expect(screen.queryAllByRole('radio')).toHaveLength(0)
  })
})