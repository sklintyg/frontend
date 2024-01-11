import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { expect, it, describe, beforeEach } from 'vitest'
import { SickLeavePeriodWarning } from './SickLeavePeriodWarning'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { setSickLeavePeriodWarning } from '../../../../store/fmb/fmbActions'
import { fmbMiddleware } from '../../../../store/fmb/fmbMiddleware'

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

  it('displays warning', () => {
    renderComponent()
    testStore.dispatch(setSickLeavePeriodWarning(WARNING))
    expect(screen.getByText(WARNING)).toBeInTheDocument()
  })
})
