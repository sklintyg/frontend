import React from 'react'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import reducer from '../../../store/reducers'
import { createPatient } from '../../../components/patient/patientTestUtils'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { errorMiddleware } from '../../../store/error/errorMiddleware'
import userEvent from '@testing-library/user-event'
import { MissingRelatedCertificateModal } from './MissingRelatedCertificateModal'
import { createNewCertificate } from '../../../store/certificate/certificateActions'

let testStore: EnhancedStore
const history = createMemoryHistory()
const PATIENT_ID = '191212121212'
const CONFITM_BUTTON = 'Skapa dödsorsaksintyg'
const setOpen = () => {
  return true
}

const renderComponent = (isOpen: boolean) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <MissingRelatedCertificateModal
          createCertificateType="doi"
          confirmButtonText={CONFITM_BUTTON}
          patient={createPatient(PATIENT_ID)}
          setOpen={setOpen}
          open={isOpen}
          name=""
          description=""
          enabled={true}
          body=""
        />
      </Router>
    </Provider>
  )
}

describe('MissingRelatedCertificateModal', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, errorMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should show modal if open is true', () => {
    renderComponent(true)
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('should not render when open is false', () => {
    renderComponent(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should show button for creating new certificate', () => {
    renderComponent(true)
    expect(screen.getByText(CONFITM_BUTTON)).toBeInTheDocument()
  })

  it('should create certificate on confirm', () => {
    renderComponent(true)
    userEvent.click(screen.getByText(CONFITM_BUTTON))

    const createNewCertificateAction = dispatchedActions.find((action) => createNewCertificate.match(action))
    expect(createNewCertificateAction?.payload).toEqual({ certificateType: 'doi', patientId: PATIENT_ID })
  })
})
