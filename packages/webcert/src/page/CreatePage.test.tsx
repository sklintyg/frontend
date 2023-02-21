import { LoginMethod, ResourceLinkType, SigningMethod, Unit, User } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { resetCertificateState } from '../store/certificate/certificateActions'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateIsLoadingUser, updateUser, updateUserResourceLinks } from '../store/user/userActions'
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
    testStore.dispatch(updateUser(getUser()))
    testStore.dispatch(
      updateUserResourceLinks([{ type: ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, description: '', name: '', body: '', enabled: true }])
    )
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should reset state when page is loaded', () => {
    renderComponent()
    expect(dispatchedActions.find((action) => resetCertificateState.match(action))).toBeDefined()
  })
})

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
    careProviders: [
      {
        id: '',
        name: 'Care Provider',
        missingSubscription: false,
        careUnits: [
          {
            unitId: '1234a',
            unitName: 'Care unit',
            address: '',
            zipCode: '',
            city: '',
            phoneNumber: '',
            email: '',
            isInactive: false,
            units: [
              {
                unitId: '1234b',
                unitName: 'Unit',
                address: '',
                zipCode: '',
                city: '',
                phoneNumber: '',
                email: '',
                isInactive: false,
              },
            ],
          },
        ],
      },
    ],
  }
}
