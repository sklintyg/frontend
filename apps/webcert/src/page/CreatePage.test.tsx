import { EnhancedStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { fakeUser } from '../faker'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateSlice'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateIsLoadingUser, updateUser, updateUserResourceLinks } from '../store/user/userActions'
import { ResourceLinkType } from '../types'
import { CreatePageWithRedirect } from './CreatePage'

let testStore: EnhancedStore
const history = createMemoryHistory()
history.replace = vi.fn()

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/create']}>
        <Route path="/create/:patientId?">
          <CreatePageWithRedirect />
        </Route>
      </MemoryRouter>
    </Provider>
  )
}

describe('SearchAndCreatePage', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware])

    testStore.dispatch(updateIsLoadingUser(false))
    testStore.dispatch(updateUser(fakeUser()))
    testStore.dispatch(
      updateUserResourceLinks([{ type: ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, description: '', name: '', body: '', enabled: true }])
    )
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should dispatch resetCertificateState and updateShouldRouteAfterDelete actions on mount', () => {
    renderComponent()
    expect(dispatchedActions.find((action) => resetCertificateState.match(action))).toBeDefined()
    expect(dispatchedActions.find((action) => updateShouldRouteAfterDelete.match(action))).toBeDefined()
  })

  it('should reset state when page is loaded', () => {
    renderComponent()
    expect(dispatchedActions.find((action) => resetCertificateState.match(action))).toBeDefined()
  })

  it('should dispatch resetCertificateState before updateShouldRouteAfterDelete', () => {
    renderComponent()

    const resetCertificateStateIndex = dispatchedActions.findIndex((action) => resetCertificateState.match(action))

    const updateShouldRouteAfterDeleteIndex = dispatchedActions.findIndex((action) => updateShouldRouteAfterDelete.match(action))

    expect(resetCertificateStateIndex).toBeLessThan(updateShouldRouteAfterDeleteIndex)
  })
})
