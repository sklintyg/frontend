import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import SrsRiskOpinion from './SrsRiskOpinion'
import { SRS_OPINION_LABELS } from '../srsUtils'

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
    renderComponent()
    expect(screen.getAllByRole('radio')).toHaveLength(4)
  })

  it.each(SRS_OPINION_LABELS)('should render radio button label', (label) => {
    renderComponent()
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
