import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store/store'
import { updateUser } from '../../store/user/userActions'
import { LoginMethod, PopUpModal, SigningMethod, Unit, User } from '@frontend/common'
import { CareProviderModalContent } from './CareProviderModalContent'

const renderComponent = (user: User) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <PopUpModal modalTitle="Välj vårdgivare" open={user && !user.loggedInUnit.unitId}>
          <CareProviderModalContent />
        </PopUpModal>
      </BrowserRouter>
    </Provider>
  )
}

describe('Care provider modal', () => {
  it('should show care provider modal if logged in unit is not set', () => {
    store.dispatch(updateUser(getUserWithEmptyUnit()))

    renderComponent(getUserWithEmptyUnit())
    expect(screen.getByText('Välj vårdenhet')).toBeInTheDocument()
  })

  it('should not show modal if logged in unit is set', () => {
    store.dispatch(updateUser(getUser()))

    renderComponent(getUser())
    expect(screen.queryByText('Välj vårdenhet')).not.toBeInTheDocument()
  })

  it('should show care units when care provider modal is open', () => {
    store.dispatch(updateUser(getUserWithEmptyUnit()))

    renderComponent(getUserWithEmptyUnit())
    expect(screen.getByText('Care unit')).toBeInTheDocument()
  })
})

const getUserWithEmptyUnit = (): User => {
  const emptyUnit = {} as Unit

  return {
    hsaId: '',
    name: '',
    role: 'doctor',
    loggedInUnit: emptyUnit,
    loggedInCareUnit: emptyUnit,
    loggedInCareProvider: emptyUnit,
    preferences: null,
    loginMethod: LoginMethod.BANK_ID,
    signingMethod: SigningMethod.FAKE,
    protectedPerson: false,
    careProviders: [
      {
        id: '',
        name: 'Care Provider',
        careUnits: [
          {
            unitId: '',
            unitName: 'Care unit',
            address: '',
            zipCode: '',
            city: '',
            phoneNumber: '',
            email: '',
            isInactive: false,
            units: [
              {
                unitId: '',
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

const getUser = (): User => {
  const unit: Unit = {
    unitId: 'unitId',
    unitName: 'unit name',
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
