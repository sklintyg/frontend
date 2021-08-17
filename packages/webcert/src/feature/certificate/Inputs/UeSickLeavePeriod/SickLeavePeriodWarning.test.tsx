import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { SickLeavePeriodWarning } from './SickLeavePeriodWarning'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../../../store/reducers'
import { fmbMiddleware } from '../../../../store/fmb/fmbMiddleware'
import { setSickLeavePeriodWarning, updateFMBDiagnosisCodeInfo } from '../../../../store/fmb/fmbActions'

let testStore: EnhancedStore
const WARNING = 'warning string'

beforeEach(() => {
  testStore = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(...fmbMiddleware),
  })
})

const renderComponent = () => {
  render(
    <Provider store={store}>
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
