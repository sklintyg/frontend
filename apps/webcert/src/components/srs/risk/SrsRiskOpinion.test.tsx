import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fakeSrsPrediction } from '../../../faker'
import { updateSrsPredictions } from '../../../store/srs/srsActions'
import store from '../../../store/store'
import { SRS_OPINION_LABELS } from '../srsUtils'
import SrsRiskOpinion from './SrsRiskOpinion'

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
