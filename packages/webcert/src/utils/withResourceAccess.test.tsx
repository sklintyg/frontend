import React from 'react'
import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createBrowserHistory } from 'history'
import { withResourceAccess } from './withResourceAccess'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { LoginMethod, ResourceLinkType, SigningMethod, Unit, User } from '@frontend/common'
import { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import reducer from '../store/reducers'
import { updateIsLoadingUser, updateUser, updateUserResourceLinks } from '../store/user/userActions'

let testStore: EnhancedStore
const history = createBrowserHistory()
history.replace = jest.fn()
const Component: React.FC = () => <p>Component</p>

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const renderComponent = (history: History<unknown>) => {
  const ComponentWithRedirect = withResourceAccess(Component)
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <ComponentWithRedirect />
      </Router>
    </Provider>
  )
}

const getUser = (): User => {
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
    role: 'doctor',
    loggedInUnit: unit,
    loggedInCareUnit: unit,
    loggedInCareProvider: unit,
    preferences: null,
    loginMethod: LoginMethod.BANK_ID,
    signingMethod: SigningMethod.FAKE,
    protectedPerson: false,
  }
}

describe('withAccessResource', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should show spinner while loading user', () => {
    renderComponent(history)
    testStore.dispatch(updateIsLoadingUser(true))

    expect(screen.queryByText('Laddar...')).toBeInTheDocument()
  })

  it('should redirect to start page if resource link does not exist', () => {
    history.location.pathname = '/create'
    testStore.dispatch(updateIsLoadingUser(false))
    testStore.dispatch(updateUser(getUser()))
    renderComponent(history)

    expect(history.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/',
      })
    )
  })

  it('should render wrapped component if resource link exists', () => {
    history.location.pathname = '/create'
    testStore.dispatch(updateIsLoadingUser(false))
    testStore.dispatch(updateUser(getUser()))
    testStore.dispatch(
      updateUserResourceLinks([{ type: ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, description: '', name: '', body: '', enabled: true }])
    )
    renderComponent(history)

    expect(screen.getByText('Component')).toBeInTheDocument()
  })
})
