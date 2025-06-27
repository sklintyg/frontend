import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { fakePatient, fakeResourceLink } from '../../../faker'
import { createNewCertificate } from '../../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { errorMiddleware } from '../../../store/error/errorMiddleware'
import { clearDispatchedActions, dispatchedActions, dispatchHelperMiddleware } from '../../../store/test/dispatchHelperMiddleware'
import { ResourceLinkType } from '../../../types'
import { MissingRelatedCertificateModal } from './MissingRelatedCertificateModal'

let testStore: EnhancedStore
const patient = fakePatient()
const CONFIRM_BUTTON = 'Skapa dödsorsaksintyg'
const setOpen = () => true
const missingRelatedCertificate = fakeResourceLink({
  type: ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION,
  name: 'Dödsbevis saknas',
  body: 'Är du säker att du vill skapa ett dödsorsaksintyg?',
})

const renderComponent = (isOpen: boolean) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <MissingRelatedCertificateModal
          createCertificateType="doi"
          confirmButtonText={CONFIRM_BUTTON}
          patient={patient}
          setOpen={setOpen}
          open={isOpen}
          {...missingRelatedCertificate}
        />
      </MemoryRouter>
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
    expect(screen.getByRole('dialog')).toBeInTheDocument()
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

  it('should create certificate on confirm', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByText(CONFIRM_BUTTON))

    const createNewCertificateAction = dispatchedActions.find((action) => createNewCertificate.match(action))
    expect(createNewCertificateAction?.payload).toEqual({ certificateType: 'doi', patientId: patient.personId.id })
  })
})
