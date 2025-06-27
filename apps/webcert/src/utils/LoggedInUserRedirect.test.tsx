import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { apiMiddleware } from '../store/api/apiMiddleware'
import { configureApplicationStore } from '../store/configureApplicationStore'
import { clearDispatchedActions, dispatchHelperMiddleware } from '../store/test/dispatchHelperMiddleware'
import { updateIsLoadingUser, updateUser } from '../store/user/userActions'
import { userMiddleware } from '../store/user/userMiddleware'
import type { Unit, User } from '../types'
import { SigningMethod } from '../types'
import { LoggedInUserRedirect } from './LoggedInUserRedirect'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<LoggedInUserRedirect>Test</LoggedInUserRedirect>} />
          <Route path="/search" element="you are on the search page" />
          <Route path="/list/unhandledcertificates" element="you are on the unhandled certificates page" />
        </Routes>
      </MemoryRouter>
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

  it('should show spinner while loading user', async () => {
    renderComponent()
    testStore.dispatch(updateIsLoadingUser(true))

    expect(await screen.findByText('Laddar...')).toBeInTheDocument()
  })

  it('should redirect to /search if logged in as doctor', () => {
    const doctor = getDummyUser('Läkare')
    testStore.dispatch(updateUser(doctor))
    renderComponent()

    expect(screen.getByText(/you are on the search page/i)).toBeInTheDocument()
  })

  it('should redirect to /search if logged in as nurse', () => {
    const doctor = getDummyUser('Sjuksköterska')
    testStore.dispatch(updateUser(doctor))
    renderComponent()

    expect(screen.getByText(/you are on the search page/i)).toBeInTheDocument()
  })

  it('should redirect to /list/unhandledcertificates  if logged in as care admin', () => {
    const doctor = getDummyUser('Vårdadministratör')
    testStore.dispatch(updateUser(doctor))
    renderComponent()

    expect(screen.getByText(/you are on the unhandled certificates page/i)).toBeInTheDocument()
  })

  it('should render wrapped component if doctor or care admin not loaded', () => {
    renderComponent()

    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
