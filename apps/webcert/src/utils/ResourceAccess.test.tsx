import { getByType } from '@frontend/utils'
import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fakeUser } from '../faker'
import { configureApplicationStore } from '../store/configureApplicationStore'
import { throwError } from '../store/error/errorActions'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateIsLoadingUser, updateUser, updateUserResourceLinks } from '../store/user/userActions'
import { ResourceLinkType } from '../types'
import { ResourceAccess } from './ResourceAccess'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/create']}>
        <Routes>
          <Route
            path="/create/:patientId?"
            element={
              <ResourceAccess linkType={ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE}>
                <p>Component</p>
              </ResourceAccess>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('withAccessResource', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should show spinner while loading user', () => {
    renderComponent()
    testStore.dispatch(updateIsLoadingUser(true))

    expect(screen.getByText('Laddar...')).toBeInTheDocument()
  })

  it('should throw a not authorized error', () => {
    testStore.dispatch(updateIsLoadingUser(false))
    testStore.dispatch(updateUser(fakeUser()))
    renderComponent()

    expect(dispatchedActions).toHaveLength(3)
    expect(getByType(dispatchedActions, throwError.type)).toBeDefined()
  })

  it('should render wrapped component if resource link exists', () => {
    testStore.dispatch(updateIsLoadingUser(false))
    testStore.dispatch(updateUser(fakeUser()))
    testStore.dispatch(
      updateUserResourceLinks([{ type: ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, description: '', name: '', body: '', enabled: true }])
    )
    renderComponent()

    expect(screen.getByText('Component')).toBeInTheDocument()
  })
})
