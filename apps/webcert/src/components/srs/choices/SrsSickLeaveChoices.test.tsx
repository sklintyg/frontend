import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { fakeCertificate } from '../../../faker'
import { updateCertificate } from '../../../store/certificate/certificateSlice'
import { updateUserClientContext } from '../../../store/srs/srsActions'
import store from '../../../store/store'
import { CertificateRelationType, CertificateStatus, SrsSickLeaveChoice, SrsUserClientContext } from '../../../types'
import { SICKLEAVE_CHOICES_TEXTS } from '../srsUtils'
import SrsSickLeaveChoices from './SrsSickLeaveChoices'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <SrsSickLeaveChoices />
    </Provider>
  )
}

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

describe('SRS Sick Leave Choices', () => {
  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  afterEach(() => {
    store.dispatch(updateUserClientContext(SrsUserClientContext.SRS_UTK))
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

  it('should have new chosen as default', async () => {
    renderComponent()
    await expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[0])).toBeChecked()
    await expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[1])).not.toBeChecked()
    await expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2])).not.toBeChecked()
  })

  it('should have extension chosen as default if certificate is an extension of another certificate', async () => {
    renderComponent()
    setRenewedCertificateToState()
    await expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[0])).not.toBeChecked()
    await expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[1])).toBeChecked()
    await expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2])).not.toBeChecked()
  })

  it('should switch checked radio button when user clicks', async () => {
    renderComponent()
    await userEvent.click(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2]))
    await expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2])).toBeChecked()
  })

  it('should update state when clicking radio button', async () => {
    renderComponent()
    await userEvent.click(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2]))
    expect(store.getState().ui.uiSRS.sickLeaveChoice).toEqual(SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS)
  })

  it('should disable new radio button if sick leave is extension', async () => {
    renderComponent()
    setRenewedCertificateToState()
    await expect(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[0])).toBeDisabled()
  })

  it('should not update user client context if choosing extension after 60 days', async () => {
    renderComponent()
    await userEvent.click(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[2]))
    expect(store.getState().ui.uiSRS.userClientContext).not.toEqual(SrsUserClientContext.SRS_FRL)
  })

  it('should not update user client context if choosing extension', async () => {
    renderComponent()
    await userEvent.click(screen.getByLabelText(SICKLEAVE_CHOICES_TEXTS[1]))
    expect(store.getState().ui.uiSRS.userClientContext).not.toEqual(SrsUserClientContext.SRS_FRL)
  })
})
