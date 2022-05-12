import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store/store'
import CareProviderModal from './CareProviderModal'
import { updateUser } from '../../store/user/userActions'
import { LoginMethod, SigningMethod, Unit, User } from '@frontend/common'

describe('Care provider modal', () => {
  const renderComponent = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CareProviderModal title="Välj vårdenhet" />
        </BrowserRouter>
      </Provider>
    )
  }

  it('should show care provider modal if loggedInCareProvider is not set', () => {
    store.dispatch(updateUser(getUserWithEmptyUnit()))
    renderComponent()
    expect(screen.getByText('Välj vårdenhet')).toBeInTheDocument()
  })
})

const getUserWithEmptyUnit = (): User => {
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
    loggedInCareProvider: {},
    preferences: null,
    loginMethod: LoginMethod.BANK_ID,
    signingMethod: SigningMethod.FAKE,
    protectedPerson: false,
    careProviders: [
      {
        id: '',
        name: '',
        careUnits: [
          {
            unitId: '',
            unitName: '',
            address: '',
            zipCode: '',
            city: '',
            phoneNumber: '',
            email: '',
            isInactive: false,
            units: [
              {
                unitId: '',
                unitName: '',
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
