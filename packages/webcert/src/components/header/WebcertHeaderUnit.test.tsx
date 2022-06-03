import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { getUser, getUserWithInactiveUnit } from '@frontend/common'
import WebcertHeaderUnit from './WebcertHeaderUnit'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import apiMiddleware from '../../store/api/apiMiddleware'
import { userMiddleware } from '../../store/user/userMiddleware'
import reducer from '@frontend/webcert/src/store/reducers'
import { updateUser } from '../../store/user/userActions'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <WebcertHeaderUnit />
    </Provider>
  )
}

describe('Webcert header unit', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, userMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('displays care provider and unit that user is logged into', (): void => {
    testStore.dispatch(updateUser(getUser()))
    renderComponent()

    expect(screen.getByText(/Care unit/i)).toBeInTheDocument()
  })

  describe('Inactive unit', () => {
    it('should not display inactive message for active unit', (): void => {
      testStore.dispatch(updateUser(getUser()))
      renderComponent()

      expect(screen.queryByText(/Inaktiv enhet/i)).not.toBeInTheDocument()
    })

    it('should display inactive message for inactive unit', (): void => {
      testStore.dispatch(updateUser(getUserWithInactiveUnit()))
      renderComponent()

      expect(screen.getByText(/Inaktiv enhet/i, { exact: false })).toBeInTheDocument()
    })
  })
})
