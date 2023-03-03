import { SigningMethod, Unit, User } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { vi } from 'vitest'
import { apiMiddleware } from '../store/api/apiMiddleware'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateIsLoadingUser, updateUser } from '../store/user/userActions'
import { userMiddleware } from '../store/user/userMiddleware'
import { LoggedInUserRedirect } from './LoggedInUserRedirect'

let testStore: EnhancedStore
const testHistory = createBrowserHistory()
testHistory.replace = vi.fn()

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={testHistory}>
        <LoggedInUserRedirect>Test</LoggedInUserRedirect>
      </Router>
    </Provider>
  )
}

const getDummyUser = (role: string): User => {
  const unit: Unit = {
    unitId: '',
    unitName: '',
    address: '',
    zipCode: '',
    city: '',
    phoneNumber: '',
    email: '',
    isInactive: false,
  }
  return {
    hsaId: '',
    name: '',
    role,
    loggedInUnit: unit,
    loggedInCareUnit: unit,
    loggedInCareProvider: unit,
    preferences: null,
    signingMethod: SigningMethod.FAKE,
    protectedPerson: false,
  } as User
}

describe('LoggedInUserRedirect', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, userMiddleware])
    testStore.dispatch(updateIsLoadingUser(false))
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should show spinner while loading user', () => {
    renderComponent()
    testStore.dispatch(updateIsLoadingUser(true))

    expect(screen.queryByText('Laddar...')).toBeInTheDocument()
  })

  it('should redirect to /create if logged in as doctor', () => {
    renderComponent()
    const doctor = getDummyUser('Läkare')
    testStore.dispatch(updateUser(doctor))

    expect(testHistory.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/search',
      })
    )
  })

  it('should redirect to /list/unhandledcertificates  if logged in as care admin', () => {
    renderComponent()
    const doctor = getDummyUser('Vårdadministratör')
    testStore.dispatch(updateUser(doctor))

    expect(testHistory.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/list/unhandledcertificates',
      })
    )
  })

  it('should render wrapped component if doctor or care admin not loaded', () => {
    renderComponent()

    expect(screen.queryByText('Test')).toBeInTheDocument()
  })
})
