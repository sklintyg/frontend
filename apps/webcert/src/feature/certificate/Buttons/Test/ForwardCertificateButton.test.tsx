import { ResourceLinkType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import dispatchHelperMiddleware from '../../../../store/test/dispatchHelperMiddleware'
import ForwardCertificateButton from '../ForwardCertificateButton'

const NAME = 'Forward button name'
const DESCRIPTION = 'Forward button description'
const UNIT_NAME = 'Vårdenhet'
const CARE_PROVIDER_NAME = 'Vårdgivare'
const CERTIFICATE_ID = 'xxx'
const CERTIFICATE_TYPE = 'type'

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
        certificateType={CERTIFICATE_TYPE}
        enabled
        forwarded={false}
        functionDisabled={false}
      />
    </Provider>
  )

Object.defineProperty(global.window, 'open', { value: vi.fn() })

describe('Forward certificate button', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware])
  })

  it('opens email with text about draft', () => {
    const openSpy = vi.spyOn(window, 'open')
    renderDefaultComponent()
    screen.getByText(NAME).click()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('utkast'), '_blank')
  })

  it('opens email with text about question', () => {
    const openSpy = vi.spyOn(window, 'open')
    renderDefaultComponent(ResourceLinkType.FORWARD_QUESTION)
    screen.getByText(NAME).click()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('%A4rende'), '_blank')
  })

  it('opens email with link based on current host', () => {
    const openSpy = vi.spyOn(window, 'open')
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...location,
      protocol: 'http:',
      host: 'host',
    })

    renderDefaultComponent()
    screen.getByText(NAME).click()

    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent('http://host')), '_blank')
  })

  it('opens email with correct link', () => {
    const openSpy = vi.spyOn(window, 'open')
    renderDefaultComponent(ResourceLinkType.FORWARD_QUESTION)
    screen.getByText(NAME).click()
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('%2Fwebcert%2Fweb%2Fuser%2Fbasic-certificate%2Ftype%2Fxxx%2Fquestions'),
      '_blank'
    )
  })
})
