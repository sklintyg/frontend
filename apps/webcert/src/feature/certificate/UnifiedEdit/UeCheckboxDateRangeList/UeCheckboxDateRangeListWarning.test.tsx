import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { setPeriodWarning } from '../../../../store/fmb/fmbActions'
import { fmbMiddleware } from '../../../../store/fmb/fmbMiddleware'
import { UeCheckboxDateRangeListWarning } from './UeCheckboxDateRangeListWarning'

let testStore: EnhancedStore
const WARNING = 'warning string'

beforeEach(() => {
  testStore = configureApplicationStore([fmbMiddleware])
})

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <UeCheckboxDateRangeListWarning />
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
    testStore.dispatch(setPeriodWarning(WARNING))
    expect(await screen.findByText(WARNING)).toBeInTheDocument()
  })
})
