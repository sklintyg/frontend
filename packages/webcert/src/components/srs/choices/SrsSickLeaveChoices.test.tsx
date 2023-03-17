import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import SrsSickLeaveChoices from './SrsSickLeaveChoices'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { CertificateRelationType, CertificateStatus, fakeCertificate, SrsSickLeaveChoice } from '@frontend/common'
import userEvent from '@testing-library/user-event'
import { SICKLEAVE_CHOICES_TEXTS } from '../srsUtils'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <SrsSickLeaveChoices />
    </Provider>
  )
}

describe('SRS Sick Leave Choices', () => {
  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should present new radio button', () => {
    renderComponent()
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[0])).toBeInTheDocument()
  })

  it('should present extension radio button', () => {
    renderComponent()
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[1])).toBeInTheDocument()
  })

  it('should present extension after 60 days radio button', () => {
    renderComponent()
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2])).toBeInTheDocument()
  })

  it('should have new chosen as default', () => {
    renderComponent()
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[0])).toBeChecked()
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[1])).not.toBeChecked()
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2])).not.toBeChecked()
  })

  it('should have extension chosen as default if certificate is an extension of another certificate', () => {
    renderComponent()
    setRenewedCertificateToState()
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[0])).not.toBeChecked()
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[1])).toBeChecked()
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2])).not.toBeChecked()
  })

  it('should switch checked radio button when user clicks', () => {
    renderComponent()
    userEvent.click(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2]))
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2])).toBeChecked()
  })

  it('should update state when clicking radio button', () => {
    renderComponent()
    userEvent.click(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2]))
    expect(store.getState().ui.uiSRS.sickLeaveChoice).toEqual(SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS)
  })

  it('should disable new radio button if sick leave is extension', () => {
    renderComponent()
    setRenewedCertificateToState()
    expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[0])).toBeDisabled()
  })
})

const setRenewedCertificateToState = () => {
  const certificate = fakeCertificate()
  certificate.metadata.relations.parent = {
    certificateId: 'id',
    type: CertificateRelationType.RENEW,
    status: CertificateStatus.SIGNED,
    created: '',
  }
  store.dispatch(updateCertificate(certificate))
}
