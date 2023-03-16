import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import SrsNationalStatistics, { SRS_STATISTICS_INFO, SRS_STATISTICS_TITLE } from './SrsNationalStatistics'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <SrsNationalStatistics />
    </Provider>
  )
}

describe('SRS National Statistics', () => {
  it('should render component without problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render statistics title', () => {
    renderComponent()
    expect(screen.getByText(SRS_STATISTICS_TITLE)).toBeInTheDocument()
  })

  it('should render statistics info', () => {
    renderComponent()
    expect(screen.getByText(SRS_STATISTICS_INFO)).toBeInTheDocument()
  })
})
