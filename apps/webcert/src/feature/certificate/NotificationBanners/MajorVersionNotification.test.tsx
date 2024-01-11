import { fakeCertificate, fakeCertificateMetaData } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { expect, it, describe, beforeEach } from 'vitest'
import MajorVersionNotification from './MajorVersionNotification'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../../store/configureApplicationStore'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <MajorVersionNotification />
    </Provider>
  )
}

const INFO_TEXT = 'Du kan inte använda alla funktioner, intyget är av en äldre version.'

const setState = (latestMajorVersion: boolean) => {
  testStore.dispatch(updateCertificate(fakeCertificate({ metadata: fakeCertificateMetaData({ latestMajorVersion }) })))
}

describe('MajorVersionNotification', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([])
  })

  it('shall render a banner if not latest major version', () => {
    setState(false)
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT)).toBeInTheDocument()
  })

  it('shall not render a banner if latest major version', () => {
    setState(true)
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })

  it('shall not render a banner if empty state', () => {
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })
})
