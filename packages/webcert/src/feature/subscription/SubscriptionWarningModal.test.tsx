import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../store/reducers'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { userMiddleware } from '../../store/user/userMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { createMemoryHistory } from 'history'
import SubscriptionWarningModal from './SubscriptionWarningModal'
import { updateUserResourceLinks } from '../../store/user/userActions'
import { getSubscriptionWarningResourceLink } from '@frontend/common'
import userEvent from '@testing-library/user-event'

let testStore: EnhancedStore
const history = createMemoryHistory()
history.push = jest.fn()

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <SubscriptionWarningModal />
    </Provider>
  )
}

describe('Subscription warning modal', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, userMiddleware),
    })
  })

  afterEach(() => clearDispatchedActions())

  it('should show modal when SUBSCRIPTION_WARNING resource link exists', () => {
    testStore.dispatch(updateUserResourceLinks(getSubscriptionWarningResourceLink()))

    renderComponent()
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('should close modal when clicking on close button', () => {
    testStore.dispatch(updateUserResourceLinks(getSubscriptionWarningResourceLink()))

    renderComponent()

    userEvent.click(screen.getByText('Stäng'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
