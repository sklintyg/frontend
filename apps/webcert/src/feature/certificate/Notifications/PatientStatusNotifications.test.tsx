import { Certificate, CertificateMetadata, Patient, PersonId } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import PatientStatusNotifications from './PatientStatusNotifications'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <PatientStatusNotifications />
    </Provider>
  )
}

const INFO_TEXT_DECEASED = 'Patienten är avliden'
const INFO_TEXT_PROTECTED = 'Patienten har skyddade personuppgifter'
const INFO_TEXT_DIFFERENT_NAME = 'Patientens namn skiljer sig från det i journalsystemet'
const INFO_TEXT_DIFFERENT_ID = 'Patientens personnummer har ändrats'
const ALTERNATE_ID = '1912121213'
const PERSON_ID = '191111111111'
const INFO_TEXT_RESERVE_ID = `Patienten har samordningsnummer kopplat till reservnummer: ${PERSON_ID}`

const createCertificate = (
  deceased: boolean,
  protectedPerson: boolean,
  differentNameFromEHR: boolean,
  previousPersonId: PersonId | undefined,
  personIdChanged: boolean,
  reserveId: boolean
): Certificate =>
  ({
    metadata: {
      patient: {
        deceased,
        protectedPerson,
        differentNameFromEHR,
        previousPersonId,
        personIdChanged,
        reserveId,
        personId: {
          id: PERSON_ID,
        } as PersonId,
      } as Patient,
    } as CertificateMetadata,
  } as Certificate)

const setState = ({
  isDeceased,
  isProtectedPerson,
  isNameDifferentFromEHR,
  previousPersonId,
  personIdChanged,
  reserveId = false,
}: {
  isDeceased: boolean
  isProtectedPerson: boolean
  isNameDifferentFromEHR: boolean
  previousPersonId: PersonId | undefined
  personIdChanged: boolean
  reserveId?: boolean
}) => {
  testStore.dispatch(
    updateCertificate(
      createCertificate(isDeceased, isProtectedPerson, isNameDifferentFromEHR, previousPersonId, personIdChanged, reserveId)
    )
  )
}

describe('PatientStatusNotifications', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([])
  })

  it('shall render deceased status if set', () => {
    setState({
      isDeceased: true,
      isProtectedPerson: false,
      isNameDifferentFromEHR: false,
      previousPersonId: undefined,
      personIdChanged: false,
    })
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_DECEASED)).toBeInTheDocument()
  })

  it('shall not render deceased status if not set', () => {
    setState({
      isDeceased: false,
      isProtectedPerson: false,
      isNameDifferentFromEHR: false,
      previousPersonId: undefined,
      personIdChanged: false,
    })
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_DECEASED)).not.toBeInTheDocument()
  })

  it('shall render protected person status if set', () => {
    setState({
      isDeceased: false,
      isProtectedPerson: true,
      isNameDifferentFromEHR: false,
      previousPersonId: undefined,
      personIdChanged: false,
    })
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_PROTECTED)).toBeInTheDocument()
  })

  it('shall not render protected status if not set', () => {
    setState({
      isDeceased: false,
      isProtectedPerson: false,
      isNameDifferentFromEHR: false,
      previousPersonId: undefined,
      personIdChanged: false,
    })
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_PROTECTED)).not.toBeInTheDocument()
  })

  it('shall render different name status if set', () => {
    setState({
      isDeceased: false,
      isProtectedPerson: false,
      isNameDifferentFromEHR: true,
      previousPersonId: undefined,
      personIdChanged: false,
    })
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_NAME)).toBeInTheDocument()
  })

  it('shall not render different name status if not set', () => {
    setState({
      isDeceased: false,
      isProtectedPerson: false,
      isNameDifferentFromEHR: false,
      previousPersonId: undefined,
      personIdChanged: false,
    })
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_DIFFERENT_NAME)).not.toBeInTheDocument()
  })

  it('shall render different id status if set', () => {
    setState({
      isDeceased: false,
      isProtectedPerson: false,
      isNameDifferentFromEHR: false,
      previousPersonId: { id: ALTERNATE_ID, type: 'PERSON_NUMMER' },
      personIdChanged: true,
    })
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_ID)).toBeInTheDocument()
  })

  it('shall not render different id status if not set', () => {
    setState({
      isDeceased: false,
      isProtectedPerson: false,
      isNameDifferentFromEHR: false,
      previousPersonId: undefined,
      personIdChanged: false,
    })
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_DIFFERENT_ID)).not.toBeInTheDocument()
  })

  it('shall render reserve id status if alternate person id but it is not replaced', () => {
    setState({
      isDeceased: true,
      isProtectedPerson: true,
      isNameDifferentFromEHR: false,
      previousPersonId: { id: ALTERNATE_ID, type: 'PERSON_NUMMER' },
      personIdChanged: false,
      reserveId: true,
    })
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_RESERVE_ID)).toBeInTheDocument()
  })

  it('shall not render reserve id status if not set', () => {
    setState({
      isDeceased: false,
      isProtectedPerson: false,
      isNameDifferentFromEHR: false,
      previousPersonId: undefined,
      personIdChanged: false,
    })
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_RESERVE_ID)).not.toBeInTheDocument()
  })

  it('shall render all statuses except reserve id', () => {
    setState({
      isDeceased: true,
      isProtectedPerson: true,
      isNameDifferentFromEHR: true,
      previousPersonId: { id: ALTERNATE_ID, type: 'PERSON_NUMMER' },
      personIdChanged: true,
    })
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_RESERVE_ID)).not.toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_NAME)).toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_ID)).toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_DECEASED)).toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_PROTECTED)).toBeInTheDocument()
  })

  it('shall render all statuses except different id', () => {
    setState({
      isDeceased: true,
      isProtectedPerson: true,
      isNameDifferentFromEHR: true,
      previousPersonId: { id: ALTERNATE_ID, type: 'PERSON_NUMMER' },
      personIdChanged: false,
      reserveId: true,
    })
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_RESERVE_ID)).toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_NAME)).toBeInTheDocument()
    expect(screen.queryByText(INFO_TEXT_DIFFERENT_ID)).not.toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_DECEASED)).toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_PROTECTED)).toBeInTheDocument()
  })
})
