import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Certificate } from '@frontend/common'
import MajorVersionNotification from './MajorVersionNotification'
import { Provider } from 'react-redux'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import reducer from '../../../store/reducers'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <MajorVersionNotification />
    </Provider>
  )
}

const INFO_TEXT = 'Du kan inte använda alla funktioner, intyget är av en äldre version.'

describe('MajorVersionNotification', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    })
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

const setState = (isLatestMajorVersion: boolean) => {
  const certificate = createCertificate(isLatestMajorVersion)
  testStore.dispatch(updateCertificate(certificate))
}

const createCertificate = (isLatestMajorVersion: boolean): Certificate => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    metadata: { latestMajorVersion: isLatestMajorVersion },
  }
}
