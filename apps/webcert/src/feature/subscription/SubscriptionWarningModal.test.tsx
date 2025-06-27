import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { fakeResourceLink } from '../../faker'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { clearDispatchedActions, dispatchHelperMiddleware } from '../../store/test/dispatchHelperMiddleware'
import { updateUserResourceLinks } from '../../store/user/userActions'
import { userMiddleware } from '../../store/user/userMiddleware'
import { ResourceLinkType } from '../../types'
import SubscriptionWarningModal from './SubscriptionWarningModal'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <SubscriptionWarningModal />
    </Provider>
  )
}

describe('Subscription warning modal', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, userMiddleware])
  })

  afterEach(() => clearDispatchedActions())

  it('should show modal when SUBSCRIPTION_WARNING resource link exists', () => {
    testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.SUBSCRIPTION_WARNING })]))

    renderComponent()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should close modal when clicking on close button', async () => {
    testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.SUBSCRIPTION_WARNING })]))

    renderComponent()

    await userEvent.click(screen.getByText('Stäng'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
