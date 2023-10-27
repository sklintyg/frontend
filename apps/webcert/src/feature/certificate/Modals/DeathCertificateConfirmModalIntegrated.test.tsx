import { fakeCertificate, fakeCertificateMetaData } from '@frontend/common'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createPatient } from '../../../components/patient/patientTestUtils'
import { deleteCertificate, updateCertificate } from '../../../store/certificate/certificateActions'
import { renderWithStore } from '../../../utils/renderWithStore'
import { DeathCertificateConfirmModalIntegrated } from './DeathCertificateConfirmModalIntegrated'

const PERSON_ID = '191212121212'

const renderComponent = (isOpen: boolean) => {
  const { store, clearCalledActions, ...other } = renderWithStore(
    <DeathCertificateConfirmModalIntegrated
      patient={createPatient(PERSON_ID)}
      certificateId="certificateId"
      setOpen={() => true}
      open={isOpen}
    />
  )
  store.dispatch(updateCertificate(fakeCertificate({ metadata: fakeCertificateMetaData({ id: 'certificateId' }) })))
  clearCalledActions()

  return { store, clearCalledActions, ...other }
}

describe('DeathCertificateConfirmModalIntegrated', () => {
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

  it('should show button for delete', () => {
    renderComponent(true)
    expect(screen.getByText('Radera')).toBeInTheDocument()
  })

  it('should dispatch delete certificate on close', async () => {
    const { getCalledActions } = renderComponent(true)

    await userEvent.click(screen.getByText('Radera'))

    expect(getCalledActions()).toContainEqual({ type: deleteCertificate.type, payload: { certificateId: 'certificateId' } })
  })

  it('should not close modal when clicking outside the modal', async () => {
    renderComponent(true)
    await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  describe('Confirm button', () => {
    it('should show button for confirm', () => {
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
      await userEvent.click(screen.getByRole('checkbox'))
      expect(screen.getByText('Gå vidare')).not.toBeDisabled()
    })
  })
})
