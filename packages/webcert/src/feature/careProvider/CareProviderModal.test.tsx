import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { updateUser, updateUserStatistics } from '../../store/user/userActions'
import { LoginMethod, SigningMethod, Unit, User, UserStatistics, UnitStatistic, UnitStatistics } from '@frontend/common'
import CareProviderModal from './CareProviderModal'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../store/reducers'
import apiMiddleware from '../../store/api/apiMiddleware'
import { userMiddleware } from '../../store/user/userMiddleware'
import MockAdapter from 'axios-mock-adapter/types'

let fakeAxios: MockAdapter
let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <BrowserRouter>
        <CareProviderModal />
      </BrowserRouter>
    </Provider>
  )
}

describe('Care provider modal', () => {
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiMiddleware, userMiddleware),
    })
  })

  it('should show care provider modal if logged in unit is not set', () => {
    testStore.dispatch(updateUser(getUserWithEmptyUnit()))
    testStore.dispatch(updateUserStatistics(getUserStatistics()))

    renderComponent()
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('should not show modal if logged in unit is set', () => {
    testStore.dispatch(updateUser(getUser()))

    renderComponent()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should close modal when unit is chosen', () => {
    testStore.dispatch(updateUser(getUserWithEmptyUnit()))
    testStore.dispatch(updateUserStatistics(getUserStatistics()))
    fakeAxios.onPost('/api/user/unit/1234a').reply(200, getUser())

    renderComponent()

    userEvent.click(screen.getByText('Care unit'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should show care units when care provider modal is open', () => {
    testStore.dispatch(updateUser(getUserWithEmptyUnit()))

    renderComponent()
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

const getUser = (): User => {
  const unit: Unit = {
    unitId: '1234a',
    unitName: 'Care unit',
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

const getUserStatistics = (): UserStatistics => {
  const unitStatistic: UnitStatistic = {
    draftsOnUnit: 3,
    questionsOnUnit: 0,
    draftsOnSubUnits: 1,
    questionsOnSubUnits: 5,
  }

  const unitStatistics: UnitStatistics = {
    '1234a': unitStatistic,
    '1234b': unitStatistic,
  }

  return {
    nbrOfDraftsOnSelectedUnit: 6,
    nbrOfUnhandledQuestionsOnSelectedUnit: 10,
    totalDraftsAndUnhandledQuestionsOnOtherUnits: 17,
    unitStatistics: unitStatistics,
  }
}
