import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { SickLeavePeriodWarning } from './SickLeavePeriodWarning'
import { Provider } from 'react-redux'
import { EnhancedStore } from '@reduxjs/toolkit'
import { fmbMiddleware } from '../../../../store/fmb/fmbMiddleware'
import { setSickLeavePeriodWarning } from '../../../../store/fmb/fmbActions'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'

let testStore: EnhancedStore
const WARNING = 'warning string'

beforeEach(() => {
  testStore = configureApplicationStore([fmbMiddleware])
})

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <SickLeavePeriodWarning></SickLeavePeriodWarning>
    </Provider>
  )
}

describe('Sick leave period warning', () => {
  it('renders without crashing', () => {
    renderComponent()
  })

  it('does not display warning', () => {
    renderComponent()
    expect(screen.queryByText(WARNING)).not.toBeInTheDocument()
  })

  it('displays warning', () => {
    renderComponent()
    testStore.dispatch(setSickLeavePeriodWarning(WARNING))
    expect(screen.queryByText(WARNING)).toBeInTheDocument()
  })
})
