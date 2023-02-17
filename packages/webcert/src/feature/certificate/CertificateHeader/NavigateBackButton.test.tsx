import { getNavigateBackButtonLink, getUser } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiMiddleware } from '../../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware from '../../../store/test/dispatchHelperMiddleware'
import { updateUser, updateUserResourceLinks } from '../../../store/user/userActions'
import { userMiddleware } from '../../../store/user/userMiddleware'
import NavigateBackButton from './NavigateBackButton'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <NavigateBackButton />
    </Provider>
  )
}

vi.mock('react-router-dom', () => ({
  ...vi.requireActual('react-router-dom'),
  useHistory: () => ({
    push: vi.fn(),
    length: 1,
  }),
}))

describe('NavigateBackButton', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, userMiddleware])
  })

  it('should show navigate back button if link is available', () => {
    testStore.dispatch(updateUser(getUser()))
    testStore.dispatch(updateUserResourceLinks(getNavigateBackButtonLink()))
    renderComponent()
    expect(screen.getByText('Tillbaka')).toBeInTheDocument()
  })

  it('should not show navigate back button if link is not available', () => {
    testStore.dispatch(updateUser(getUser()))
    renderComponent()
    expect(screen.queryByText('Tillbaka')).not.toBeInTheDocument()
  })
})
