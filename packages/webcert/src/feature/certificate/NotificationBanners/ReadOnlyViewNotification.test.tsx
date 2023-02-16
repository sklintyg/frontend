import { Certificate, CertificateMetadata, Unit, User } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { updateUser } from '../../../store/user/userActions'
import ReadOnlyViewNotification from './ReadOnlyViewNotification'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <ReadOnlyViewNotification />
    </Provider>
  )
}

const CARE_UNIT_ID = 'CARE_UNIT_ID'
const CARE_UNIT_NAME = 'CARE_UNIT_NAME'
const CARE_PROVIDER_ID = 'CARE_PROVIDER_ID'
const CARE_PROVIDER_NAME = 'CARE_UNIT_NAME'
const USER_LOGGED_IN_CARE_UNIT_ID = 'USER_LOGGED_IN_CARE_UNIT_ID'
const USER_LOGGED_IN_CARE_PROVIDER_ID = 'USER_LOGGED_IN_CARE_PROVIDER_ID'

const INFO_TEXT = `Utfärdat på: ${CARE_PROVIDER_NAME} - ${CARE_UNIT_NAME}`

describe('ReadOnlyViewNotification', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([])
  })

  it('shall render a banner if care provider id is same but not unit id', () => {
    setState(CARE_UNIT_ID, CARE_PROVIDER_ID, USER_LOGGED_IN_CARE_UNIT_ID, CARE_PROVIDER_ID)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT)).toBeInTheDocument()
  })

  it('shall not render a banner if care provider is same and unit id is same', () => {
    setState(CARE_UNIT_ID, CARE_PROVIDER_ID, CARE_UNIT_ID, CARE_PROVIDER_ID)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })

  it('shall render a banner if care provider id and unit id is not same', () => {
    setState(CARE_UNIT_ID, CARE_PROVIDER_ID, USER_LOGGED_IN_CARE_UNIT_ID, USER_LOGGED_IN_CARE_PROVIDER_ID)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).toBeInTheDocument()
  })

  it('shall not render a banner if care provider is different but unit id is same', () => {
    setState(CARE_UNIT_ID, CARE_PROVIDER_ID, CARE_UNIT_ID, USER_LOGGED_IN_CARE_PROVIDER_ID)
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

const createUser = (userCareUnitId: string, userCareProviderId: string): User => {
  return {
    loggedInCareUnit: {
      unitId: userCareUnitId,
    } as Unit,
    loggedInCareProvider: {
      unitId: userCareProviderId,
    } as Unit,
  } as User
}

const createCertificate = (careUnitId: string, careProviderId: string): Certificate => {
  return {
    metadata: {
      careUnit: {
        unitId: careUnitId,
        unitName: CARE_UNIT_NAME,
      } as Unit,
      careProvider: {
        unitId: careProviderId,
        unitName: CARE_PROVIDER_NAME,
      } as Unit,
    } as CertificateMetadata,
  } as Certificate
}
