import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { updateUser } from '../../store/user/userActions'
import ResponsibleHospName from './ResponsibleHospName'
import { fakeCertificate, fakeCertificateMetaData, fakeUser } from '../../faker'
import { CertificateStatus, ResourceLinkType } from '../../types'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <ResponsibleHospName />
    </Provider>
  )
}

const RESPONSIBLE_HOSP_NAME = 'Doctor Test-Doctorsson'
const RESPONSIBLE_CERTIFICATE_ISSUER = 'Ansvarig intygsutfärdare'
const NOT_SPECIFIED = 'Ej angivet'

const setState = (certificateStatus: CertificateStatus, responsibleHospName: string, type?: ResourceLinkType) => {
  const certificate = fakeCertificate({
    links: type ? [{ type, name: '', description: '', enabled: true }] : [],
    metadata: fakeCertificateMetaData({ status: certificateStatus, responsibleHospName }),
  })
  testStore.dispatch(updateUser(fakeUser()))
  testStore.dispatch(updateCertificate(certificate))
}

describe('ResponsibleHospName', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([])
  })

  it('shall not render responsible certificate issuer when link is not available', () => {
    setState(CertificateStatus.UNSIGNED, RESPONSIBLE_HOSP_NAME)
    renderDefaultComponent()
    expect(screen.queryByText(RESPONSIBLE_CERTIFICATE_ISSUER)).not.toBeInTheDocument()
    expect(screen.queryByText(RESPONSIBLE_HOSP_NAME)).not.toBeInTheDocument()
    expect(screen.queryByText(NOT_SPECIFIED)).not.toBeInTheDocument()
  })

  it('shall render responsible certificate issuer when link is available and hosp name has value', () => {
    setState(CertificateStatus.UNSIGNED, RESPONSIBLE_HOSP_NAME, ResourceLinkType.RESPONSIBLE_ISSUER)
    renderDefaultComponent()
    expect(screen.getByText(RESPONSIBLE_CERTIFICATE_ISSUER)).toBeInTheDocument()
    expect(screen.getByText(RESPONSIBLE_HOSP_NAME)).toBeInTheDocument()
  })

  it('shall render responsible certificate issuer not specified when user does has resource link sign and responsible hosp name is empty string', () => {
    setState(CertificateStatus.UNSIGNED, '', ResourceLinkType.RESPONSIBLE_ISSUER)
    renderDefaultComponent()
    expect(screen.getByText(RESPONSIBLE_CERTIFICATE_ISSUER)).toBeInTheDocument()
    expect(screen.getByText(NOT_SPECIFIED)).toBeInTheDocument()
  })
})
