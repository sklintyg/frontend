import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../store/store'
import PatientSearchError from './PatientSearchError'
import { ErrorCode, ErrorRequest, ErrorType } from '../../store/error/errorReducer'
import { setPatientError } from '../../store/patient/patientActions'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <PatientSearchError />
    </Provider>
  )
}

describe('PatientSearchError', () => {
  it('should show patient not found error message', () => {
    store.dispatch(setPatientError(getErrorRequest(ErrorCode.PATIENT_NOT_FOUND)))
    renderComponent()
    expect(screen.getByText('Personnumret du har angivit finns inte i folkbokföringsregistret.', { exact: false })).toBeInTheDocument()
  })

  it('should show technical problem message', () => {
    store.dispatch(setPatientError(getErrorRequest(ErrorCode.GETTING_PATIENT_ERROR)))
    renderComponent()
    expect(screen.getByText('På grund av tekniskt fel gick det inte att hämta personuppgifter', { exact: false })).toBeInTheDocument()
  })

  it('should show invalid id message', () => {
    store.dispatch(setPatientError(getErrorRequest(ErrorCode.INVALID_PATIENT_ID)))
    renderComponent()
    expect(screen.getByText('Ange ett giltigt person- eller samordningsnummer.', { exact: false })).toBeInTheDocument()
  })

  it('should show pu error message', () => {
    store.dispatch(setPatientError(getErrorRequest(ErrorCode.PU_PROBLEM)))
    renderComponent()
    expect(screen.getByText('Personuppgiftstjänsten svarar inte.', { exact: false })).toBeInTheDocument()
  })

  it('should show no name error message', () => {
    store.dispatch(setPatientError(getErrorRequest(ErrorCode.PATIENT_NO_NAME)))
    renderComponent()
    expect(screen.getByText('Förnamn eller efternamn', { exact: false })).toBeInTheDocument()
  })
})

const getErrorRequest = (code: ErrorCode): ErrorRequest => {
  return {
    errorCode: code,
    errorId: 'id',
    message: 'message',
    stackTrace: 'stackTrace',
    certificateId: 'certificateId',
    type: ErrorType.SILENT,
  }
}
