import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { updateUser, updateUserStatistics } from '../../store/user/userActions'
import {
  getUserWithEmptyUnit,
  getUserStatistics,
  getUser,
  getUserWithEmptyCareUnitWithoutUnits,
  getUserStatisticsForOneCareUnit,
} from '@frontend/common'
import CareProviderModal from './CareProviderModal'
import userEvent from '@testing-library/user-event'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../store/reducers'
import apiMiddleware from '../../store/api/apiMiddleware'
import { userMiddleware } from '../../store/user/userMiddleware'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'

let fakeAxios: MockAdapter
let testStore: EnhancedStore

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <BrowserRouter>
        <CareProviderModal />
      </BrowserRouter>
    </Provider>
  )
}

describe('Care provider modal', () => {
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, userMiddleware),
    })
  })

  afterEach(() => clearDispatchedActions())

  it('should show care provider modal if logged in unit is not set', () => {
    testStore.dispatch(updateUser(getUserWithEmptyUnit()))
    testStore.dispatch(updateUserStatistics(getUserStatistics()))

    renderComponent()
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('should not show modal if logged in unit is set', () => {
    testStore.dispatch(updateUser(getUser()))

    renderComponent()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should close modal when unit is chosen', async () => {
    testStore.dispatch(updateUser(getUserWithEmptyUnit()))
    testStore.dispatch(updateUserStatistics(getUserStatistics()))
    fakeAxios.onPost('/api/user/unit/1234a').reply(200, { user: getUser() })

    renderComponent()

    userEvent.click(screen.getByText('Care unit'))

    await flushPromises()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should show care units when care provider modal is open', () => {
    testStore.dispatch(updateUser(getUserWithEmptyUnit()))
    testStore.dispatch(updateUserStatistics(getUserStatistics()))

    renderComponent()
    expect(screen.getByText('Care unit')).toBeInTheDocument()
  })

  it('should show total amount of unhandled questions if user has units under the care unit', () => {
    testStore.dispatch(updateUser(getUserWithEmptyUnit()))
    testStore.dispatch(updateUserStatistics(getUserStatistics()))

    renderComponent()
    const text = screen.queryAllByText('total', { exact: false })
    expect(text).toBeTruthy()
  })

  it('should show NOT total amount of unhandled questions if user has no units under the care unit', () => {
    testStore.dispatch(updateUser(getUserWithEmptyCareUnitWithoutUnits()))
    testStore.dispatch(updateUserStatistics(getUserStatisticsForOneCareUnit()))

    renderComponent()
    const text = screen.queryByText('total', { exact: false })
    expect(text).not.toBeInTheDocument()
  })
})
