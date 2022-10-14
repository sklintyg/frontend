import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { withLoggedInUserRedirect } from './withLoggedInUserRedirect'
import reducer from '../store/reducers'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import apiMiddleware from '../store/api/apiMiddleware'
import { userMiddleware } from '../store/user/userMiddleware'
import { updateIsLoadingUser, updateUser } from '../store/user/userActions'
import { SigningMethod, Unit, User } from '@frontend/common'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

let testStore: EnhancedStore
const testHistory = createBrowserHistory()
testHistory.replace = jest.fn()
const Dummy: React.FC = () => <>Test</>

const renderComponent = () => {
  const DummyWithRedirect = withLoggedInUserRedirect(Dummy)
  render(
    <Provider store={testStore}>
      <Router history={testHistory}>
        <DummyWithRedirect />
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

describe('withLoggedInUserRedirect', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, userMiddleware),
    })
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
        pathname: '/create',
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
