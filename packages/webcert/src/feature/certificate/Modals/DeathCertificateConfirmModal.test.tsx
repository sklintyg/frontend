import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createPatient } from '../../../components/patient/patientTestUtils'
import { createNewCertificate } from '../../../store/certificate/certificateActions'
import { renderWithStore } from '../../../utils/renderWithStore'
import { DeathCertificateConfirmModal } from './DeathCertificateConfirmModal'

const PERSON_ID = '191212121212'

const renderComponent = (isOpen: boolean) => {
  return renderWithStore(<DeathCertificateConfirmModal patient={createPatient(PERSON_ID)} setOpen={() => true} open={isOpen} />)
}

describe('DeathCertificateConfirmModal', () => {
  it('should show modal if open is true', () => {
    renderComponent(true)
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('should not render when open is false', () => {
    renderComponent(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should display patients person id', () => {
    renderComponent(true)
    expect(screen.getByText(PERSON_ID, { exact: false })).toBeInTheDocument()
  })

  it('should display patients full name', () => {
    renderComponent(true)
    expect(screen.queryByText('firstName middleName lastName', { exact: false })).toBeInTheDocument()
  })
})

describe('Confirm button', () => {
  it('should show button to proceed', () => {
    renderComponent(true)
    expect(screen.getByText('Gå vidare')).toBeInTheDocument()
  })

  it('should disable confirm button when checkbox in not checked', () => {
    renderComponent(true)
    const confirmButton = screen.getByText('Gå vidare')

    expect(confirmButton).toBeDisabled()
  })

  it('should enable confirm button when checkbox in checked', async () => {
    renderComponent(true)
    const confirmCheckbox = screen.getByRole('checkbox')
    await userEvent.click(confirmCheckbox)

    const confirmButton = screen.getByText('Gå vidare')
    expect(confirmButton).not.toBeDisabled()
  })

  it('should dispatch create new certificate on proceed', async () => {
    const { getCalledActions } = renderComponent(true)

    const confirmCheckbox = screen.getByRole('checkbox')
    await userEvent.click(confirmCheckbox)

    const confirmButton = screen.getByText('Gå vidare')
    await userEvent.click(confirmButton)
    expect(getCalledActions()).toContainEqual({ type: createNewCertificate.type, payload: { certificateType: 'db', patientId: PERSON_ID } })
  })
})

describe('Cancel button', () => {
  it('should show button to cancel', () => {
    renderComponent(true)
    expect(screen.getByText('Avbryt')).toBeInTheDocument()
  })

  it('Cancelling shall not create certificate', async () => {
    const { getCalledActions, clearCalledActions } = renderComponent(true)
    clearCalledActions()

    await userEvent.click(screen.getByText('Avbryt'))

    expect(getCalledActions()).toHaveLength(0)
  })
})
