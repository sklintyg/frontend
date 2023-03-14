import { LoginMethod, ResourceLinkType, SigningMethod, Unit, User } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'
import { configureApplicationStore } from '../store/configureApplicationStore'
import { throwError } from '../store/error/errorActions'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateIsLoadingUser, updateUser, updateUserResourceLinks } from '../store/user/userActions'
import { ResourceAccess } from './ResourceAccess'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/create']}>
        <Route path="/create/:patientId?">
          <ResourceAccess linkType={ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE}>
            <p>Component</p>
          </ResourceAccess>
        </Route>
      </MemoryRouter>
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
  } as User
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

    expect(screen.queryByText('Laddar...')).toBeInTheDocument()
  })

  it('should throw a not authorized error', () => {
    testStore.dispatch(updateIsLoadingUser(false))
    testStore.dispatch(updateUser(getUser()))
    renderComponent()

    expect(dispatchedActions).toHaveLength(3)
    expect(dispatchedActions.find((a) => a.type === throwError.type)).toBeDefined()
  })

  it('should render wrapped component if resource link exists', () => {
    testStore.dispatch(updateIsLoadingUser(false))
    testStore.dispatch(updateUser(getUser()))
    testStore.dispatch(
      updateUserResourceLinks([{ type: ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, description: '', name: '', body: '', enabled: true }])
    )
    renderComponent()

    expect(screen.getByText('Component')).toBeInTheDocument()
  })
})
