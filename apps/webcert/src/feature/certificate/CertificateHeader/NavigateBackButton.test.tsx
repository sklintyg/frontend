import type { EnhancedStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { fakeResourceLink, fakeUser } from '../../../faker'
import { apiMiddleware } from '../../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware from '../../../store/test/dispatchHelperMiddleware'
import { updateUser, updateUserResourceLinks } from '../../../store/user/userActions'
import { userMiddleware } from '../../../store/user/userMiddleware'
import { ResourceLinkType } from '../../../types'
import NavigateBackButton from './NavigateBackButton'

let testStore: EnhancedStore
const history = createMemoryHistory()
const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <NavigateBackButton />
      </Router>
    </Provider>
  )
}

describe('NavigateBackButton', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, userMiddleware])
  })

  it('should show navigate back button if link is available', () => {
    testStore.dispatch(updateUser(fakeUser()))
    testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.NAVIGATE_BACK_BUTTON })]))
    renderComponent()
    expect(screen.getByText('Tillbaka')).toBeInTheDocument()
  })

  it('should not show navigate back button if link is not available', () => {
    testStore.dispatch(updateUser(fakeUser()))
    renderComponent()
    expect(screen.queryByText('Tillbaka')).not.toBeInTheDocument()
  })

  it('should use history.getBack()', () => {
    testStore.dispatch(updateUser(fakeUser()))
    testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.NAVIGATE_BACK_BUTTON })]))
    history.push('/some-page')
    history.push('/some-page1')
    history.action = 'PUSH'

    renderComponent()

    const backButton = screen.getByRole('button')
    fireEvent.click(backButton)

    expect(history.location.pathname).toBe('/some-page')
  })
})
