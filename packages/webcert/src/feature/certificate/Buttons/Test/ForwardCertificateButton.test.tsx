import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ForwardCertificateButton from '../ForwardCertificateButton'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import dispatchHelperMiddleware from '../../../../store/test/dispatchHelperMiddleware'
import reducer from '../../../../store/reducers'
import { ResourceLinkType } from '@frontend/common'

const NAME = 'Forward button name'
const DESCRIPTION = 'Forward button description'
const UNIT_NAME = 'Vårdenhet'
const CARE_PROVIDER_NAME = 'Vårdgivare'
const CERTIFICATE_ID = 'xxx'

let testStore: EnhancedStore

const renderDefaultComponent = (type: ResourceLinkType = ResourceLinkType.FORWARD_CERTIFICATE) =>
  render(
    <Provider store={testStore}>
      <ForwardCertificateButton
        name={NAME}
        description={DESCRIPTION}
        unitName={UNIT_NAME}
        careProviderName={CARE_PROVIDER_NAME}
        certificateId={CERTIFICATE_ID}
        type={type}
        enabled={true}
        forwarded={false}
        functionDisabled={false}
      />
    </Provider>
  )

describe('Forward certificate button', () => {
  const oldOpen = window.open

  beforeAll(() => {
    window.open = jest.fn()
  })

  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware),
    })
  })

  afterAll(() => {
    window.open = oldOpen
  })

  it('opens email with text about draft', () => {
    renderDefaultComponent()
    screen.getByText(NAME).click()
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('utkast'), '_blank')
  })

  it('opens email with text about question', () => {
    renderDefaultComponent(ResourceLinkType.FORWARD_QUESTION)
    screen.getByText(NAME).click()
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('%A4rende'), '_blank')
  })

  it('opens email with link based on current host', () => {
    const location: Location = window.location
    delete window.location
    window.location = {
      ...location,
      host: 'host',
    }

    renderDefaultComponent()
    screen.getByText(NAME).click()
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('http%3A%2F%2Fhost'), '_blank')

    window.location = location
  })
})
