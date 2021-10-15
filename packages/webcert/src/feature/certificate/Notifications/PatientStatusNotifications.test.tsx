import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Certificate } from '@frontend/common'
import MajorVersionNotification from './MajorVersionNotification'
import { Provider } from 'react-redux'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import reducer from '../../../store/reducers'
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
const RESERVE_ID = '1912121212'
const INFO_TEXT_RESERVE_ID = 'Patienten har samordningsnummer kopplat till reservnummer: ' + RESERVE_ID

describe('PatientStatusNotifications', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    })
  })

  it('shall render deceased status if set', () => {
    setState(true, false, false, false, '')
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_DECEASED)).toBeInTheDocument()
  })

  it('shall not render deceased status if not set', () => {
    setState(false, false, false, false, '')
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_DECEASED)).not.toBeInTheDocument()
  })

  it('shall render protected person status if set', () => {
    setState(false, true, false, false, '')
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_PROTECTED)).toBeInTheDocument()
  })

  it('shall not render protected status if not set', () => {
    setState(false, false, false, false, '')
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_PROTECTED)).not.toBeInTheDocument()
  })

  it('shall render different name status if set', () => {
    setState(false, false, true, false, '')
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_NAME)).toBeInTheDocument()
  })

  it('shall not render different name status if not set', () => {
    setState(false, false, false, false, '')
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_DIFFERENT_NAME)).not.toBeInTheDocument()
  })

  it('shall render different id status if set', () => {
    setState(false, false, false, true, '')
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_DIFFERENT_ID)).toBeInTheDocument()
  })

  it('shall not render different id status if not set', () => {
    setState(false, false, false, false, '')
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_DIFFERENT_ID)).not.toBeInTheDocument()
  })

  it('shall render reserve id status if set', () => {
    setState(true, true, false, false, RESERVE_ID)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT_RESERVE_ID)).toBeInTheDocument()
  })

  it('shall not render reserve id status if not set', () => {
    setState(false, false, false, false, '')
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_RESERVE_ID)).not.toBeInTheDocument()
  })

  it('shall render all statuses', () => {
    setState(true, true, true, true, RESERVE_ID)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT_RESERVE_ID)).toBeInTheDocument()
    expect(screen.queryByText(INFO_TEXT_DIFFERENT_NAME)).toBeInTheDocument()
    expect(screen.queryByText(INFO_TEXT_DIFFERENT_ID)).toBeInTheDocument()
    expect(screen.queryByText(INFO_TEXT_DECEASED)).toBeInTheDocument()
    expect(screen.queryByText(INFO_TEXT_PROTECTED)).toBeInTheDocument()
  })
})

const setState = (
  isDeceased: boolean,
  isProtectedPerson: boolean,
  isNameDifferentFromJS: boolean,
  isIdDifferentFromJS: boolean,
  reserveId: string
) => {
  testStore.dispatch(
    updateCertificate(createCertificate(isDeceased, isProtectedPerson, isNameDifferentFromJS, isIdDifferentFromJS, reserveId))
  )
}

const createCertificate = (
  isDeceased: boolean,
  isProtectedPerson: boolean,
  isNameDifferentFromJS: boolean,
  isIdDifferentFromJS: boolean,
  reserveId: string
): Certificate => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    metadata: {
      patient: {
        deceased: isDeceased,
        protectedPerson: isProtectedPerson,
        differentNameFromJS: isNameDifferentFromJS,
        differentIdFromJS: isIdDifferentFromJS,
        reserveId: reserveId,
      },
    },
  }
}
