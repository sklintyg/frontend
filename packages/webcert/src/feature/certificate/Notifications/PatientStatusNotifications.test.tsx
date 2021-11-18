import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Certificate } from '@frontend/common'
import { Provider } from 'react-redux'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import reducer from '../../../store/reducers'
import PatientStatusNotifications from './PatientStatusNotifications'
import { PersonId } from '@frontend/common/src'

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
const INFO_TEXT_RESERVE_ID = 'Patienten har samordningsnummer kopplat till reservnummer: ' + PERSON_ID

describe('PatientStatusNotifications', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    })
  })

  it('shall render deceased status if set', () => {
    setState(true, false, false, null, false)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_DECEASED)).toBeInTheDocument()
  })

  it('shall not render deceased status if not set', () => {
    setState(false, false, false, null, false)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_DECEASED)).not.toBeInTheDocument()
  })

  it('shall render protected person status if set', () => {
    setState(false, true, false, null, false)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_PROTECTED)).toBeInTheDocument()
  })

  it('shall not render protected status if not set', () => {
    setState(false, false, false, null, false)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_PROTECTED)).not.toBeInTheDocument()
  })

  it('shall render different name status if set', () => {
    setState(false, false, true, null, false)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_NAME)).toBeInTheDocument()
  })

  it('shall not render different name status if not set', () => {
    setState(false, false, false, null, false)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_DIFFERENT_NAME)).not.toBeInTheDocument()
  })

  it('shall render different id status if set', () => {
    setState(false, false, false, { id: ALTERNATE_ID, type: 'PERSON_NUMMER' }, true)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_ID)).toBeInTheDocument()
  })

  it('shall not render different id status if not set', () => {
    setState(false, false, false, null, false)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_DIFFERENT_ID)).not.toBeInTheDocument()
  })

  it('shall render reserve id status if alternate person id but it is not replaced', () => {
    setState(true, true, false, { id: ALTERNATE_ID, type: 'PERSON_NUMMER' }, false)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_RESERVE_ID)).toBeInTheDocument()
  })

  it('shall not render reserve id status if not set', () => {
    setState(false, false, false, null, '')
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_RESERVE_ID)).not.toBeInTheDocument()
  })

  it('shall render all statuses except reserve id', () => {
    setState(true, true, true, { id: ALTERNATE_ID, type: 'PERSON_NUMMER' }, true)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_RESERVE_ID)).not.toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_NAME)).toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_ID)).toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_DECEASED)).toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_PROTECTED)).toBeInTheDocument()
  })

  it('shall render all statuses except different id', () => {
    setState(true, true, true, { id: ALTERNATE_ID, type: 'PERSON_NUMMER' }, false)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_RESERVE_ID)).toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_NAME)).toBeInTheDocument()
    expect(screen.queryByText(INFO_TEXT_DIFFERENT_ID)).not.toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_DECEASED)).toBeInTheDocument()
    expect(screen.getByText(INFO_TEXT_PROTECTED)).toBeInTheDocument()
  })
})

const setState = (
  isDeceased: boolean,
  isProtectedPerson: boolean,
  isNameDifferentFromEHR: boolean,
  previousPersonId: PersonId | null,
  personIdUpdated: boolean
) => {
  testStore.dispatch(
    updateCertificate(createCertificate(isDeceased, isProtectedPerson, isNameDifferentFromEHR, previousPersonId, personIdUpdated))
  )
}

const createCertificate = (
  isDeceased: boolean,
  isProtectedPerson: boolean,
  isNameDifferentFromEHR: boolean,
  previousPersonId: PersonId | null,
  personIdUpdated: boolean
): Certificate => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    metadata: {
      patient: {
        deceased: isDeceased,
        protectedPerson: isProtectedPerson,
        differentNameFromEHR: isNameDifferentFromEHR,
        previousPersonId: previousPersonId,
        personIdUpdated: personIdUpdated,
        personId: {
          id: PERSON_ID,
        },
      },
    },
  }
}
