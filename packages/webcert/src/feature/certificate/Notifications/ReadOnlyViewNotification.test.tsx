import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Certificate, User } from '@frontend/common'
import ReadOnlyViewNotification from './ReadOnlyViewNotification'
import { Provider } from 'react-redux'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import reducer from '../../../store/reducers'
import { updateUser } from '../../../store/user/userActions'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <ReadOnlyViewNotification />
    </Provider>
  )
}

const UNIT_ID = 'UNIT_ID'
const UNIT_NAME = 'UNIT_NAME'
const CARE_PROVIDER_ID = 'CARE_PROVIDER_ID'
const CARE_PROVIDER_NAME = 'CARE_UNIT_NAME'
const USER_LOGGED_IN_UNIT_ID = 'USER_LOGGED_IN_UNIT_ID'
const USER_LOGGED_IN_CARE_PROVIDER_ID = 'USER_LOGGED_IN_CARE_PROVIDER_ID'

const INFO_TEXT = `Utfärdat på: ${CARE_PROVIDER_NAME} - ${UNIT_NAME}`

describe('ReadOnlyViewNotification', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    })
  })

  it('shall render a banner if care provider id is same but not unit id', () => {
    setState(UNIT_ID, CARE_PROVIDER_ID, USER_LOGGED_IN_UNIT_ID, CARE_PROVIDER_ID)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT)).toBeInTheDocument()
  })

  it('shall not render a banner if unit id is same', () => {
    setState(UNIT_ID, CARE_PROVIDER_ID, UNIT_ID, CARE_PROVIDER_ID)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })

  it('shall not render a banner if care provider id is not same', () => {
    setState(UNIT_ID, CARE_PROVIDER_ID, USER_LOGGED_IN_UNIT_ID, USER_LOGGED_IN_CARE_PROVIDER_ID)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })

  it('shall not render a banner if empty state', () => {
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })
})

const setState = (unitId: string, careProviderId: string, userUnitId: string, userCareProviderId: string) => {
  const certificate = createCertificate(unitId, careProviderId)
  const user = createUser(userUnitId, userCareProviderId)
  testStore.dispatch(updateUser(user))
  testStore.dispatch(updateCertificate(certificate))
}

const createUser = (userUnitId: string, userCareProviderId: string): User => {
  return {
    loggedInUnit: {
      unitId: userUnitId,
    },
    loggedInCareProvider: {
      unitId: userCareProviderId,
    },
  }
}

const createCertificate = (unitId: string, careProviderId: string): Certificate => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    metadata: {
      unit: {
        unitId: unitId,
        unitName: UNIT_NAME,
      },
      careProvider: {
        unitId: careProviderId,
        unitName: CARE_PROVIDER_NAME,
      },
    },
  }
}
