import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { fakeCertificate, fakeCertificateMetaData } from '../../../faker'
import InactiveCertificateTypeNotification from './InactiveCertificateTypeNotification'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <InactiveCertificateTypeNotification />
    </Provider>
  )
}

const INFO_TEXT = 'Intyget är av en äldre version. Funktionaliteten för detta intyg är begränsad.'

const setState = (inactiveCertificateType: boolean) => {
  testStore.dispatch(updateCertificate(fakeCertificate({ metadata: fakeCertificateMetaData({ inactiveCertificateType }) })))
}

describe('InactiveCertificateTypeNotificationNotification', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([])
  })

  it('shall render a banner if certificate type is inactive', () => {
    setState(true)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT)).toBeInTheDocument()
  })

  it('shall not render a banner if certificate type is not inactive', () => {
    setState(false)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })

  it('shall not render a banner if empty state', () => {
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })
})
