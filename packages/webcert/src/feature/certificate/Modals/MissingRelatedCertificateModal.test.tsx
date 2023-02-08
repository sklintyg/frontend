import React from 'react'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createPatient } from '../../../components/patient/patientTestUtils'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { errorMiddleware } from '../../../store/error/errorMiddleware'
import userEvent from '@testing-library/user-event'
import { createNewCertificate } from '../../../store/certificate/certificateActions'
import { MissingRelatedCertificateModal } from './MissingRelatedCertificateModal'
import { fakeResourceLink, ResourceLinkType } from '@frontend/common'
import { configureApplicationStore } from '../../../store/configureApplicationStore'

let testStore: EnhancedStore
const history = createMemoryHistory()
const PATIENT_ID = '191212121212'
const CONFIRM_BUTTON = 'Skapa dödsorsaksintyg'
const setOpen = () => {
  return true
}
const missingRelatedCertificate = fakeResourceLink({
  type: ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION,
  name: 'Dödsbevis saknas',
  body: 'Är du säker att du vill skapa ett dödsorsaksintyg?',
})

const renderComponent = (isOpen: boolean) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <MissingRelatedCertificateModal
          createCertificateType="doi"
          confirmButtonText={CONFIRM_BUTTON}
          patient={createPatient(PATIENT_ID)}
          setOpen={setOpen}
          open={isOpen}
          {...missingRelatedCertificate}
        />
      </Router>
    </Provider>
  )
}

describe('MissingRelatedCertificateModal', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, errorMiddleware])
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
    expect(screen.getByText(CONFIRM_BUTTON)).toBeInTheDocument()
  })

  it('should show body text in the modal', () => {
    renderComponent(true)
    expect(screen.getByText('Är du säker att du vill skapa ett dödsorsaksintyg?')).toBeInTheDocument()
  })

  it('should create certificate on confirm', () => {
    renderComponent(true)
    userEvent.click(screen.getByText(CONFIRM_BUTTON))

    const createNewCertificateAction = dispatchedActions.find((action) => createNewCertificate.match(action))
    expect(createNewCertificateAction?.payload).toEqual({ certificateType: 'doi', patientId: PATIENT_ID })
  })
})
