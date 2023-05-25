import { EnhancedStore } from '@reduxjs/toolkit'
import { act, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { setSickLeavePeriodWarning } from '../../../../store/fmb/fmbActions'
import { fmbMiddleware } from '../../../../store/fmb/fmbMiddleware'
import { SickLeavePeriodWarning } from './SickLeavePeriodWarning'

let testStore: EnhancedStore
const WARNING = 'warning string'

beforeEach(() => {
  testStore = configureApplicationStore([fmbMiddleware])
})

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <SickLeavePeriodWarning />
    </Provider>
  )
}

describe('Sick leave period warning', () => {
  it('renders without crashing', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('does not display warning', () => {
    renderComponent()
    expect(screen.queryByText(WARNING)).not.toBeInTheDocument()
  })

  it('displays warning', async () => {
    renderComponent()
    act(() => testStore.dispatch(setSickLeavePeriodWarning(WARNING)))
    expect(await screen.findByText(WARNING)).toBeInTheDocument()
  })
})
