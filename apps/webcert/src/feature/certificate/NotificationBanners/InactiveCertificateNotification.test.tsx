import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import InactiveCertificateNotification from './InactiveCertificateNotification'
import { ResourceLinkType } from '../../../types'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { fakeCertificate } from '../../../faker'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <InactiveCertificateNotification />
    </Provider>
  )
}

const INFO_TEXT = 'Denna version av intyget är inte längre aktiv. Funktionaliteten för detta intyg kan därför vara begränsad.'

const setState = () => {
  testStore.dispatch(
    updateCertificate(
      fakeCertificate({
        links: [
          {
            type: ResourceLinkType.INACTIVE_CERTIFICATE,
            name: '',
            description: '',
            enabled: true,
          },
        ],
      })
    )
  )
}

describe('InactiveCertificateNotification', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([])
  })

  it('shall render a banner if certificate type is inactive', () => {
    setState()
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT)).toBeInTheDocument()
  })

  it('shall not render a banner if certificate type is not inactive', () => {
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })
})
