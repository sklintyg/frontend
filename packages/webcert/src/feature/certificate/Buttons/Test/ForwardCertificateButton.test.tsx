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

let location: Location

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
  beforeEach(() => {
    location = window.location
    jest.spyOn(window, 'location', 'get').mockRestore()
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware),
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('opens email with text about draft', () => {
    const openSpy = jest.spyOn(window, 'open')
    openSpy.mockImplementation(jest.fn())
    renderDefaultComponent()
    screen.getByText(NAME).click()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('utkast'), '_blank')
  })

  it('opens email with text about question', () => {
    const openSpy = jest.spyOn(window, 'open')
    openSpy.mockImplementation(jest.fn())
    renderDefaultComponent(ResourceLinkType.FORWARD_QUESTION)
    screen.getByText(NAME).click()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('%A4rende'), '_blank')
  })

  it('opens email with link based on current host', () => {
    const openSpy = jest.spyOn(window, 'open')
    openSpy.mockImplementation(jest.fn())
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...location,
      host: 'host',
    })

    renderDefaultComponent()
    screen.getByText(NAME).click()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('http%3A%2F%2Fhost'), '_blank')
  })
})
