import { CertificateStatus, fakeCertificate, fakeCertificateMetaData, fakeUser } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { updateUser } from '../../store/user/userActions'
import ResponsibleHospName from './ResponsibleHospName'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <ResponsibleHospName />
    </Provider>
  )
}

const ROLE_DOCTOR = 'Läkare'
const ROLE_CARE_ADMIN = 'Vårdadministratör'
const RESPONSIBLE_HOSP_NAME = 'Doctor Test-Doctorsson'
const RESPONSIBLE_CERTIFICATE_ISSUER = 'Ansvarig intygsutfärdare'
const NOT_SPECIFIED = 'Ej angivet'

const setState = (userRole: string, certificateStatus: CertificateStatus, responsibleHospName: string) => {
  const certificate = fakeCertificate({ metadata: fakeCertificateMetaData({ status: certificateStatus, responsibleHospName }) })
  const user = fakeUser({ role: userRole })
  testStore.dispatch(updateUser(user))
  testStore.dispatch(updateCertificate(certificate))
}

describe('ResponsibleHospName', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([])
  })

  it('shall not render responsible certificate issuer when user role doctor', () => {
    setState(ROLE_DOCTOR, CertificateStatus.UNSIGNED, RESPONSIBLE_HOSP_NAME)
    renderDefaultComponent()
    expect(screen.queryByText(RESPONSIBLE_CERTIFICATE_ISSUER)).not.toBeInTheDocument()
    expect(screen.queryByText(RESPONSIBLE_HOSP_NAME)).not.toBeInTheDocument()
    expect(screen.queryByText(NOT_SPECIFIED)).not.toBeInTheDocument()
  })

  it('shall not render responsible certificate issuer when certificate status not unsigned', () => {
    setState(ROLE_CARE_ADMIN, CertificateStatus.SIGNED, RESPONSIBLE_HOSP_NAME)
    renderDefaultComponent()
    expect(screen.queryByText(RESPONSIBLE_CERTIFICATE_ISSUER)).not.toBeInTheDocument()
    expect(screen.queryByText(RESPONSIBLE_HOSP_NAME)).not.toBeInTheDocument()
    expect(screen.queryByText(NOT_SPECIFIED)).not.toBeInTheDocument()
  })

  it('shall render responsible certificate issuer when role care admin and status unsigned', () => {
    setState(ROLE_CARE_ADMIN, CertificateStatus.UNSIGNED, RESPONSIBLE_HOSP_NAME)
    renderDefaultComponent()
    expect(screen.getByText(RESPONSIBLE_CERTIFICATE_ISSUER)).toBeInTheDocument()
    expect(screen.getByText(RESPONSIBLE_HOSP_NAME)).toBeInTheDocument()
  })

  it('shall render responsible certificate issuer not specified when responsible hosp name is empty string', () => {
    setState(ROLE_CARE_ADMIN, CertificateStatus.UNSIGNED, '')
    renderDefaultComponent()
    expect(screen.getByText(RESPONSIBLE_CERTIFICATE_ISSUER)).toBeInTheDocument()
    expect(screen.getByText(NOT_SPECIFIED)).toBeInTheDocument()
  })
})
